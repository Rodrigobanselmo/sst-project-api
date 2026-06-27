import { BadRequestException, Injectable } from '@nestjs/common';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';
import * as XLSX from 'xlsx';

import {
  describeExamPayload,
  diffExamPayload,
  diffRulePayload,
  ExamEditablePayload,
  ExamRiskRuleImportClassification as Classification,
  ExamRiskRuleRowError,
  ExistingExamSnapshot,
  FieldChange,
  isRowEmpty,
  parseRuleRow,
  ParsedRuleRow,
  RawSpreadsheetRow,
  RuleEditablePayload,
} from './exam-risk-rule-import.util';
import { EXAM_RISK_RULE_SHEET_NAMES as SHEETS } from './exam-risk-rule-spreadsheet.constants';
import { ExamRiskRuleRepository } from './exam-risk-rule.repository';

export type ExamRiskRulePreviewLine = {
  rowNumber: number;
  classification: Classification;
  ruleId: string;
  ruleExamId: string;
  scope: string | null;
  referenceName: string | null;
  examId: number | null;
  examName: string | null;
  changedFields: string[];
  fieldChanges: FieldChange[];
  warnings: string[];
  errors: ExamRiskRuleRowError[];
};

export type ExamRiskRuleImportTotals = {
  read: number;
  valid: number;
  create: number;
  update: number;
  unchanged: number;
  rejected: number;
  conflict: number;
  invalid: number;
};

export type ExamRiskRuleImportPreviewResult = {
  fileName: string;
  totals: ExamRiskRuleImportTotals;
  lines: ExamRiskRulePreviewLine[];
};

/** Plano de gravação agregado por regra (consumido pelo apply). */
export type ExamRiskRuleRulePlan = {
  ruleId: string;
  ruleUpdateData: Record<string, unknown> | null;
  examCreates: { rowNumber: number; data: ExamWriteData }[];
  examUpdates: { id: string; rowNumber: number; data: ExamWriteData }[];
};

export type ExamWriteData = {
  examId: number | null;
  examNameSnapshot: string | null;
  validityInMonths: number | null;
  considerBetweenDays: number | null;
  collectionToleranceDays: number | null;
  collectionMoment: string | null;
  fromAge: number | null;
  toAge: number | null;
  minRiskDegree: number | null;
  minRiskDegreeQuantity: number | null;
  isMale: boolean;
  isFemale: boolean;
  isAdmission: boolean;
  isPeriodic: boolean;
  isChange: boolean;
  isReturn: boolean;
  isDismissal: boolean;
  deleted_at?: null;
};

export type ExamRiskRuleImportModel = {
  fileName: string;
  totals: ExamRiskRuleImportTotals;
  lines: ExamRiskRulePreviewLine[];
  plan: ExamRiskRuleRulePlan[];
};

type RawRule = Awaited<
  ReturnType<ExamRiskRuleRepository['findRulesByIdsRaw']>
>[number];

const examSnapshot = (exam: RawRule['exams'][number]): ExistingExamSnapshot => ({
  examId: exam.examId,
  validityInMonths: exam.validityInMonths,
  considerBetweenDays: exam.considerBetweenDays,
  collectionToleranceDays: exam.collectionToleranceDays,
  collectionMoment: exam.collectionMoment,
  fromAge: exam.fromAge,
  toAge: exam.toAge,
  minRiskDegree: exam.minRiskDegree,
  minRiskDegreeQuantity: exam.minRiskDegreeQuantity,
  isMale: exam.isMale,
  isFemale: exam.isFemale,
  isAdmission: exam.isAdmission,
  isPeriodic: exam.isPeriodic,
  isChange: exam.isChange,
  isReturn: exam.isReturn,
  isDismissal: exam.isDismissal,
});

@Injectable()
export class ExamRiskRuleImportPreviewService {
  constructor(private readonly repository: ExamRiskRuleRepository) {}

  async preview(params: {
    buffer: Buffer;
    fileName: string;
  }): Promise<ExamRiskRuleImportPreviewResult> {
    const model = await this.buildModel(params);
    return {
      fileName: model.fileName,
      totals: model.totals,
      lines: model.lines,
    };
  }

  async buildModel(params: {
    buffer: Buffer;
    fileName: string;
  }): Promise<ExamRiskRuleImportModel> {
    const rawRows = this.readRows(params.buffer);
    const parsedRows = rawRows.map((raw, index) =>
      parseRuleRow(raw, index + 2),
    );

    // Carrega regras e exames referenciados (raw inclui soft-deleted).
    const ruleIds = Array.from(
      new Set(parsedRows.map((p) => p.ruleId).filter((id) => id !== '')),
    );
    const examIds = Array.from(
      new Set(
        parsedRows
          .map((p) => p.exam.examId)
          .filter((id): id is number => id != null),
      ),
    );

    const [rules, systemExams] = await Promise.all([
      this.repository.findRulesByIdsRaw(ruleIds),
      this.repository.findExamsByIds(examIds),
    ]);

    const ruleById = new Map(rules.map((rule) => [rule.id, rule]));
    const systemExamById = new Map(systemExams.map((e) => [e.id, e]));

    // Conta ocorrências de ruleExamId na planilha (duplicidade → conflito).
    const ruleExamIdOccurrences = new Map<string, number>();
    parsedRows.forEach((p) => {
      if (p.ruleExamId) {
        ruleExamIdOccurrences.set(
          p.ruleExamId,
          (ruleExamIdOccurrences.get(p.ruleExamId) ?? 0) + 1,
        );
      }
    });

    // Agrupa por ruleId (rows sem ruleId tratados isoladamente).
    const groups = new Map<string, ParsedRuleRow[]>();
    const orphanRows: ParsedRuleRow[] = [];
    parsedRows.forEach((p) => {
      if (p.ruleId === '') {
        orphanRows.push(p);
        return;
      }
      const list = groups.get(p.ruleId) ?? [];
      list.push(p);
      groups.set(p.ruleId, list);
    });

    const lines: ExamRiskRulePreviewLine[] = [];
    const plan: ExamRiskRuleRulePlan[] = [];

    // Linhas órfãs (sem ruleId): importação não cria regra nova.
    for (const row of orphanRows) {
      lines.push(
        this.baseLine(row, null, {
          classification: isRowEmpty(row)
            ? Classification.UNCHANGED
            : Classification.INVALID,
          errors: isRowEmpty(row)
            ? []
            : [
                {
                  field: 'ruleId',
                  message:
                    'ruleId vazio: a importação não cria regras novas. Crie a regra pela tela e reimporte.',
                },
              ],
        }),
      );
    }

    for (const [ruleId, rows] of groups) {
      const existingRule = ruleById.get(ruleId);
      if (!existingRule) {
        rows.forEach((row) =>
          lines.push(
            this.baseLine(row, null, {
              classification: Classification.REJECTED,
              errors: [
                {
                  field: 'ruleId',
                  message: `Regra "${ruleId}" não encontrada na biblioteca.`,
                },
              ],
            }),
          ),
        );
        continue;
      }

      const groupResult = this.processGroup({
        rows,
        rule: existingRule,
        systemExamById,
        ruleExamIdOccurrences,
      });
      lines.push(...groupResult.lines);
      if (groupResult.plan) plan.push(groupResult.plan);
    }

    lines.sort((a, b) => a.rowNumber - b.rowNumber);

    return {
      fileName: params.fileName,
      totals: this.buildTotals(lines),
      lines,
      plan,
    };
  }

  private processGroup(params: {
    rows: ParsedRuleRow[];
    rule: RawRule;
    systemExamById: Map<
      number,
      { id: number; name: string; system: boolean; esocial27Code: string | null }
    >;
    ruleExamIdOccurrences: Map<string, number>;
  }): { lines: ExamRiskRulePreviewLine[]; plan: ExamRiskRuleRulePlan | null } {
    const { rows, rule, systemExamById, ruleExamIdOccurrences } = params;
    const isAgentScope = rule.scope === PcmsoExamRiskRuleScopeEnum.AGENT;
    const referenceName = this.resolveReferenceName(rule);

    // Resolve campos de regra a partir das linhas (detecta divergência).
    const ruleResolution = this.resolveRulePayload(rows, isAgentScope);

    // Conflito de regra: linhas com valores divergentes em campos de regra.
    if (ruleResolution.conflictFields.length) {
      const lines = rows.map((row) =>
        this.baseLine(row, rule, {
          classification: Classification.CONFLICT,
          referenceName,
          errors: [
            {
              field: ruleResolution.conflictFields[0],
              message: `Campos de regra divergentes entre linhas da mesma regra: ${ruleResolution.conflictFields.join(', ')}.`,
            },
          ],
        }),
      );
      return { lines, plan: null };
    }

    const resolvedRulePayload = ruleResolution.payload;
    const existingRuleSnapshot = {
      status: rule.status,
      isCurated: rule.isCurated,
      rationale: rule.rationale,
      agentName: rule.agentName,
      agentCas: rule.agentCas,
    };
    // Mudanças explícitas de campos de regra (status/rationale/agent + isCurated
    // explícito). isCurated automático é tratado abaixo.
    const ruleFieldChanges = diffRulePayload(
      existingRuleSnapshot,
      resolvedRulePayload,
      { isAgentScope },
    );

    // Status resolvido (incoming ou atual).
    const resolvedStatus = resolvedRulePayload.status ?? rule.status;

    // Avalia exames por linha (cria estrutura intermediária).
    const examRows = rows.map((row) =>
      this.evaluateExamRow({ row, rule, systemExamById, ruleExamIdOccurrences }),
    );

    // Trava ACTIVE: precisa de ao menos um exame válido após aplicar.
    const existingValidExam = rule.exams.some(
      (e) => e.deleted_at === null && e.examId != null,
    );
    const incomingValidExam = examRows.some(
      (er) => er.examIdValid && er.kind !== 'reject',
    );
    const activeAllowed = existingValidExam || incomingValidExam;
    const activeBlocked =
      resolvedStatus === PcmsoExamRiskRuleStatusEnum.ACTIVE && !activeAllowed;

    // Há gravação de exame no grupo? (create válido ou update com diff/restore).
    const groupHasExamWrite =
      !activeBlocked &&
      examRows.some((er) => {
        if (er.row.errors.length) return false;
        if (er.kind === 'create') return true;
        if (er.kind === 'update') {
          return (
            diffExamPayload(er.existingSnapshot!, er.row.exam).length > 0 ||
            er.isRestore
          );
        }
        return false;
      });

    // Decisão #2: qualquer alteração (regra OU exame) marca isCurated=true,
    // salvo quando a planilha define isCurated explicitamente.
    const anyChange = ruleFieldChanges.length > 0 || groupHasExamWrite;
    const desiredIsCurated =
      resolvedRulePayload.isCurated !== undefined
        ? resolvedRulePayload.isCurated
        : anyChange
          ? true
          : rule.isCurated;
    const isCuratedChange = desiredIsCurated !== rule.isCurated;

    // ruleChanges exibido = mudanças de campo + isCurated automático (se houver).
    const ruleChanges = [...ruleFieldChanges];
    const isCuratedAlreadyListed = ruleChanges.some(
      (c) => c.field === 'isCurated',
    );
    if (isCuratedChange && !isCuratedAlreadyListed) {
      ruleChanges.push({
        field: 'isCurated',
        from: String(rule.isCurated),
        to: String(desiredIsCurated),
      });
    }

    const lines: ExamRiskRulePreviewLine[] = [];
    const plan: ExamRiskRuleRulePlan = {
      ruleId: rule.id,
      ruleUpdateData: null,
      examCreates: [],
      examUpdates: [],
    };

    // Monta o update de regra (aplicado uma vez; atribuído à 1ª linha do grupo).
    const ruleWillChange = ruleChanges.length > 0;
    if (ruleWillChange) {
      plan.ruleUpdateData = this.buildRuleUpdateData(
        resolvedRulePayload,
        isAgentScope,
        desiredIsCurated,
      );
    }

    let ruleChangeAttributed = false;

    examRows.forEach((er) => {
      const row = er.row;
      const warnings = this.buildWarnings(row, isAgentScope);

      // Linha inteiramente vazia e sem âncora → sem alteração.
      if (er.kind === 'empty' && !ruleWillChange) {
        lines.push(
          this.baseLine(row, rule, {
            classification: Classification.UNCHANGED,
            referenceName,
            warnings,
          }),
        );
        return;
      }

      // Erros de parse → inválida.
      if (row.errors.length) {
        lines.push(
          this.baseLine(row, rule, {
            classification: Classification.INVALID,
            referenceName,
            warnings,
            errors: row.errors,
          }),
        );
        return;
      }

      // Exame rejeitado (examId inexistente/não-system; ruleExamId inválido).
      if (er.kind === 'reject') {
        lines.push(
          this.baseLine(row, rule, {
            classification: Classification.REJECTED,
            referenceName,
            examId: row.exam.examId,
            examName: er.examName,
            warnings,
            errors: er.errors,
          }),
        );
        return;
      }

      // Trava ACTIVE sem exame válido.
      if (activeBlocked) {
        lines.push(
          this.baseLine(row, rule, {
            classification: Classification.INVALID,
            referenceName,
            examId: row.exam.examId,
            examName: er.examName,
            warnings,
            errors: [
              {
                field: 'status',
                message:
                  'status=ACTIVE exige ao menos um exame válido (examId) na regra.',
              },
            ],
          }),
        );
        return;
      }

      // Mudança de regra atribuída à primeira linha do grupo (uma única vez).
      const attributedRuleChanges =
        !ruleChangeAttributed && ruleWillChange ? ruleChanges : [];
      if (attributedRuleChanges.length) ruleChangeAttributed = true;

      if (er.kind === 'create') {
        const examData = this.buildExamWriteData(row.exam, er.examName);
        plan.examCreates.push({ rowNumber: row.rowNumber, data: examData });
        const examChanges = describeExamPayload(row.exam);
        lines.push(
          this.baseLine(row, rule, {
            classification: Classification.CREATE,
            referenceName,
            examId: row.exam.examId,
            examName: er.examName,
            warnings,
            fieldChanges: [...attributedRuleChanges, ...examChanges],
          }),
        );
        return;
      }

      if (er.kind === 'update') {
        const examChanges = diffExamPayload(er.existingSnapshot!, row.exam);
        const examWillWrite = examChanges.length > 0 || er.isRestore;
        const restoreChange: FieldChange[] = er.isRestore
          ? [{ field: 'deleted_at', from: 'removido', to: 'restaurado' }]
          : [];
        const allChanges = [
          ...attributedRuleChanges,
          ...restoreChange,
          ...examChanges,
        ];
        if (allChanges.length === 0) {
          lines.push(
            this.baseLine(row, rule, {
              classification: Classification.UNCHANGED,
              referenceName,
              examId: row.exam.examId,
              examName: er.examName,
              warnings,
            }),
          );
          return;
        }
        // Só grava o exame se ELE mudou (mudança de regra não escreve exame).
        if (examWillWrite) {
          plan.examUpdates.push({
            id: er.existingExamId!,
            rowNumber: row.rowNumber,
            data: {
              ...this.buildExamWriteData(row.exam, er.examName),
              ...(er.isRestore ? { deleted_at: null } : {}),
            },
          });
        }
        lines.push(
          this.baseLine(row, rule, {
            classification: Classification.UPDATE,
            referenceName,
            examId: row.exam.examId,
            examName: er.examName,
            warnings,
            changedFields: allChanges.map((c) => c.field),
            fieldChanges: allChanges,
          }),
        );
        return;
      }

      // er.kind === 'empty' mas houve mudança de regra (rule-only row).
      lines.push(
        this.baseLine(row, rule, {
          classification: attributedRuleChanges.length
            ? Classification.UPDATE
            : Classification.UNCHANGED,
          referenceName,
          warnings,
          changedFields: attributedRuleChanges.map((c) => c.field),
          fieldChanges: attributedRuleChanges,
        }),
      );
    });

    const planHasWrites =
      plan.ruleUpdateData !== null ||
      plan.examCreates.length > 0 ||
      plan.examUpdates.length > 0;

    return { lines, plan: planHasWrites ? plan : null };
  }

  /** Avalia o alvo de exame de uma linha (sem decidir conflito/active). */
  private evaluateExamRow(params: {
    row: ParsedRuleRow;
    rule: RawRule;
    systemExamById: Map<
      number,
      { id: number; name: string; system: boolean; esocial27Code: string | null }
    >;
    ruleExamIdOccurrences: Map<string, number>;
  }): {
    row: ParsedRuleRow;
    kind: 'empty' | 'create' | 'update' | 'reject';
    examName: string | null;
    examIdValid: boolean;
    existingExamId: string | null;
    existingSnapshot: ExistingExamSnapshot | null;
    isRestore: boolean;
    errors: ExamRiskRuleRowError[];
  } {
    const { row, rule, systemExamById, ruleExamIdOccurrences } = params;
    const examId = row.exam.examId;
    const examInfo = examId != null ? systemExamById.get(examId) : undefined;
    const examIdValid = examId == null || (!!examInfo && examInfo.system);
    const examName = examInfo?.name ?? null;

    // Sem dado de exame nesta linha.
    if (!row.hasExamData) {
      return {
        row,
        kind: 'empty',
        examName: null,
        examIdValid: false,
        existingExamId: null,
        existingSnapshot: null,
        isRestore: false,
        errors: [],
      };
    }

    // examId informado mas inexistente / não-system → rejeitar.
    if (examId != null && (!examInfo || !examInfo.system)) {
      return {
        row,
        kind: 'reject',
        examName: null,
        examIdValid: false,
        existingExamId: null,
        existingSnapshot: null,
        isRestore: false,
        errors: [
          {
            field: 'examId',
            message: `examId ${examId} não existe no catálogo system/global de exames.`,
          },
        ],
      };
    }

    // Âncora de exame (ruleExamId) presente → update/restore.
    if (row.ruleExamId) {
      if ((ruleExamIdOccurrences.get(row.ruleExamId) ?? 0) > 1) {
        return {
          row,
          kind: 'reject',
          examName,
          examIdValid,
          existingExamId: null,
          existingSnapshot: null,
          isRestore: false,
          errors: [
            {
              field: 'ruleExamId',
              message: 'ruleExamId duplicado na planilha.',
            },
          ],
        };
      }
      const existing = rule.exams.find((e) => e.id === row.ruleExamId);
      if (!existing) {
        return {
          row,
          kind: 'reject',
          examName,
          examIdValid,
          existingExamId: null,
          existingSnapshot: null,
          isRestore: false,
          errors: [
            {
              field: 'ruleExamId',
              message: `ruleExamId "${row.ruleExamId}" não pertence a esta regra.`,
            },
          ],
        };
      }
      return {
        row,
        kind: 'update',
        examName: examName ?? existing.examNameSnapshot ?? null,
        examIdValid,
        existingExamId: existing.id,
        existingSnapshot: examSnapshot(existing),
        isRestore: existing.deleted_at !== null,
        errors: [],
      };
    }

    // Sem ruleExamId mas com dados de exame → novo exame; examId é exigido.
    if (examId == null) {
      return {
        row,
        kind: 'reject',
        examName: null,
        examIdValid: false,
        existingExamId: null,
        existingSnapshot: null,
        isRestore: false,
        errors: [
          {
            field: 'examId',
            message:
              'Novo exame exige examId válido (ruleExamId vazio + configuração de exame).',
          },
        ],
      };
    }

    return {
      row,
      kind: 'create',
      examName,
      examIdValid,
      existingExamId: null,
      existingSnapshot: null,
      isRestore: false,
      errors: [],
    };
  }

  private resolveRulePayload(
    rows: ParsedRuleRow[],
    isAgentScope: boolean,
  ): { payload: RuleEditablePayload; conflictFields: string[] } {
    const fields: (keyof RuleEditablePayload)[] = [
      'status',
      'isCurated',
      'rationale',
    ];
    if (isAgentScope) fields.push('agentName', 'agentCas');

    const payload: RuleEditablePayload = {};
    const conflictFields: string[] = [];

    for (const field of fields) {
      const values = new Set<string>();
      let lastValue: unknown;
      rows.forEach((row) => {
        const v = row.rule[field];
        if (v !== undefined) {
          values.add(JSON.stringify(v));
          lastValue = v;
        }
      });
      if (values.size > 1) {
        conflictFields.push(field);
      } else if (values.size === 1) {
        (payload as Record<string, unknown>)[field] = lastValue;
      }
    }

    return { payload, conflictFields };
  }

  private buildRuleUpdateData(
    payload: RuleEditablePayload,
    isAgentScope: boolean,
    desiredIsCurated: boolean,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (payload.status !== undefined) data.status = payload.status;
    if (payload.rationale !== undefined) data.rationale = payload.rationale;
    if (isAgentScope) {
      if (payload.agentName !== undefined) {
        data.agentName = payload.agentName;
        data.agentNameNormalized = this.normalizeAgentName(payload.agentName);
      }
      if (payload.agentCas !== undefined) data.agentCas = payload.agentCas;
    }
    // Decisão #2: alteração por import marca isCurated=true (protege NR-07),
    // a menos que a planilha defina explicitamente o valor.
    data.isCurated = desiredIsCurated;
    return data;
  }

  private buildExamWriteData(
    exam: ExamEditablePayload,
    examName: string | null,
  ): ExamWriteData {
    return {
      examId: exam.examId,
      examNameSnapshot: examName,
      validityInMonths: exam.validityInMonths,
      considerBetweenDays: exam.considerBetweenDays,
      collectionToleranceDays: exam.collectionToleranceDays,
      collectionMoment: exam.collectionMoment,
      fromAge: exam.fromAge,
      toAge: exam.toAge,
      minRiskDegree: exam.minRiskDegree,
      minRiskDegreeQuantity: exam.minRiskDegreeQuantity,
      isMale: exam.isMale,
      isFemale: exam.isFemale,
      isAdmission: exam.isAdmission,
      isPeriodic: exam.isPeriodic,
      isChange: exam.isChange,
      isReturn: exam.isReturn,
      isDismissal: exam.isDismissal,
    };
  }

  private buildWarnings(row: ParsedRuleRow, isAgentScope: boolean): string[] {
    const warnings: string[] = [];
    if (row.readonlyTouched.length) {
      warnings.push(
        `Colunas read-only ignoradas: ${row.readonlyTouched.join(', ')}.`,
      );
    }
    if (
      !isAgentScope &&
      (row.rule.agentName !== undefined || row.rule.agentCas !== undefined)
    ) {
      warnings.push(
        'agentName/agentCas só são editáveis em regras de escopo AGENT; ignorados.',
      );
    }
    return warnings;
  }

  private normalizeAgentName(value?: string | null): string | null {
    if (!value) return null;
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private resolveReferenceName(rule: RawRule): string | null {
    return (
      rule.riskNameSnapshot ??
      rule.subTypeNameSnapshot ??
      rule.agentName ??
      rule.riskCategory ??
      null
    );
  }

  private baseLine(
    row: ParsedRuleRow,
    rule: RawRule | null,
    overrides: Partial<ExamRiskRulePreviewLine> & {
      classification: Classification;
    },
  ): ExamRiskRulePreviewLine {
    return {
      rowNumber: row.rowNumber,
      classification: overrides.classification,
      ruleId: row.ruleId,
      ruleExamId: row.ruleExamId,
      scope: rule?.scope ?? null,
      referenceName: overrides.referenceName ?? null,
      examId: overrides.examId ?? row.exam.examId,
      examName: overrides.examName ?? null,
      changedFields: overrides.changedFields ?? [],
      fieldChanges: overrides.fieldChanges ?? [],
      warnings: overrides.warnings ?? [],
      errors: overrides.errors ?? [],
    };
  }

  private readRows(buffer: Buffer): RawSpreadsheetRow[] {
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    } catch {
      throw new BadRequestException('Arquivo inválido. Envie um .xlsx válido.');
    }
    const sheet = workbook.Sheets[SHEETS.DATA];
    if (!sheet) {
      throw new BadRequestException(
        `Aba "${SHEETS.DATA}" não encontrada na planilha.`,
      );
    }
    return XLSX.utils.sheet_to_json<RawSpreadsheetRow>(sheet, {
      defval: null,
      raw: false,
    });
  }

  private buildTotals(
    lines: ExamRiskRulePreviewLine[],
  ): ExamRiskRuleImportTotals {
    const count = (c: Classification) =>
      lines.filter((l) => l.classification === c).length;
    const create = count(Classification.CREATE);
    const update = count(Classification.UPDATE);
    const unchanged = count(Classification.UNCHANGED);
    const rejected = count(Classification.REJECTED);
    const conflict = count(Classification.CONFLICT);
    const invalid = count(Classification.INVALID);
    return {
      read: lines.length,
      valid: create + update + unchanged,
      create,
      update,
      unchanged,
      rejected,
      conflict,
      invalid,
    };
  }
}
