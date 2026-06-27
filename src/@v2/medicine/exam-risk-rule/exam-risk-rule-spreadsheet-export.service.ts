import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

import {
  EXAM_RISK_RULE_COLUMN_ORDER,
  EXAM_RISK_RULE_COLUMN_WIDTHS,
  EXAM_RISK_RULE_REFERENCE_VALUES,
  EXAM_RISK_RULE_SHEET_NAMES as SHEETS,
} from './exam-risk-rule-spreadsheet.constants';
import { ExamRiskRuleRepository } from './exam-risk-rule.repository';

type ExportRule = Awaited<
  ReturnType<ExamRiskRuleRepository['findAllRulesWithExams']>
>[number];

@Injectable()
export class ExamRiskRuleSpreadsheetExportService {
  constructor(private readonly repository: ExamRiskRuleRepository) {}

  /** Exporta a biblioteca completa (uma linha por exame sugerido). */
  async exportCurrentBase(): Promise<Buffer> {
    const rules = await this.repository.findAllRulesWithExams();

    const examIds = Array.from(
      new Set(
        rules.flatMap((rule) =>
          rule.exams
            .map((exam) => exam.examId)
            .filter((id): id is number => id != null),
        ),
      ),
    );
    const exams = await this.repository.findExamsByIds(examIds);
    const examById = new Map(exams.map((exam) => [exam.id, exam]));

    const esocialCodes = Array.from(
      new Set(
        exams
          .map((exam) => exam.esocial27Code)
          .filter((code): code is string => !!code),
      ),
    );
    const procedures =
      await this.repository.findEsocialProcedureNamesByCodes(esocialCodes);
    const procedureNameByCode = new Map(
      procedures.map((proc) => [proc.procedureCode, proc.procedureNameSnapshot]),
    );

    const workbook = this.createWorkbook();
    const sheet = workbook.addWorksheet(SHEETS.DATA);
    this.setupDataSheetColumns(sheet);

    for (const rule of rules) {
      const ruleCols = this.ruleColumns(rule);
      if (!rule.exams.length) {
        sheet.addRow({ ...ruleCols, ...this.emptyExamColumns() });
        continue;
      }
      for (const exam of rule.exams) {
        const examInfo = exam.examId ? examById.get(exam.examId) : undefined;
        const esocial27Code = examInfo?.esocial27Code ?? '';
        sheet.addRow({
          ...ruleCols,
          ruleExamId: exam.id,
          examId: exam.examId ?? '',
          examName: exam.examNameSnapshot ?? examInfo?.name ?? '',
          esocial27Code,
          procedureNameSnapshot: esocial27Code
            ? procedureNameByCode.get(esocial27Code) ?? ''
            : '',
          validityInMonths: exam.validityInMonths ?? '',
          considerBetweenDays: exam.considerBetweenDays ?? '',
          collectionToleranceDays: exam.collectionToleranceDays ?? '',
          collectionMoment: exam.collectionMoment ?? '',
          isMale: String(exam.isMale),
          isFemale: String(exam.isFemale),
          isAdmission: String(exam.isAdmission),
          isPeriodic: String(exam.isPeriodic),
          isChange: String(exam.isChange),
          isReturn: String(exam.isReturn),
          isDismissal: String(exam.isDismissal),
          fromAge: exam.fromAge ?? '',
          toAge: exam.toAge ?? '',
          minRiskDegree: exam.minRiskDegree ?? '',
          minRiskDegreeQuantity: exam.minRiskDegreeQuantity ?? '',
        });
      }
    }

    this.addInstructionsSheet(workbook);
    this.addReferencesSheet(workbook);
    return this.toBuffer(workbook);
  }

  async buildTemplate(): Promise<Buffer> {
    const workbook = this.createWorkbook();
    const sheet = workbook.addWorksheet(SHEETS.DATA);
    this.setupDataSheetColumns(sheet);
    this.addInstructionsSheet(workbook);
    this.addReferencesSheet(workbook);
    return this.toBuffer(workbook);
  }

  private ruleColumns(rule: ExportRule) {
    return {
      ruleId: rule.id,
      scope: rule.scope,
      source: rule.source,
      sourceIndicatorId: rule.sourceIndicatorId ?? '',
      referenceName: this.resolveReferenceName(rule),
      riskNameSnapshot: rule.riskNameSnapshot ?? '',
      subTypeNameSnapshot: rule.subTypeNameSnapshot ?? '',
      agentNameNormalized: rule.agentNameNormalized ?? '',
      agentName: rule.agentName ?? '',
      agentCas: rule.agentCas ?? '',
      status: rule.status,
      isCurated: String(rule.isCurated),
      rationale: rule.rationale ?? '',
    };
  }

  private resolveReferenceName(rule: ExportRule): string {
    return (
      rule.riskNameSnapshot ??
      rule.subTypeNameSnapshot ??
      rule.agentName ??
      rule.riskCategory ??
      ''
    );
  }

  private emptyExamColumns() {
    return {
      ruleExamId: '',
      examId: '',
      examName: '',
      esocial27Code: '',
      procedureNameSnapshot: '',
      validityInMonths: '',
      considerBetweenDays: '',
      collectionToleranceDays: '',
      collectionMoment: '',
      isMale: '',
      isFemale: '',
      isAdmission: '',
      isPeriodic: '',
      isChange: '',
      isReturn: '',
      isDismissal: '',
      fromAge: '',
      toAge: '',
      minRiskDegree: '',
      minRiskDegreeQuantity: '',
    };
  }

  private createWorkbook(): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SimpleSST';
    workbook.created = new Date();
    return workbook;
  }

  private setupDataSheetColumns(sheet: ExcelJS.Worksheet) {
    sheet.columns = EXAM_RISK_RULE_COLUMN_ORDER.map((key) => ({
      header: key,
      key,
      width: EXAM_RISK_RULE_COLUMN_WIDTHS[key] ?? 16,
    }));
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle' };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  private addInstructionsSheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet(SHEETS.INSTRUCTIONS);
    sheet.columns = [
      { header: 'Tópico', key: 'topic', width: 32 },
      { header: 'Descrição', key: 'description', width: 110 },
    ];
    sheet.getRow(1).font = { bold: true };

    const rows: Array<[string, string]> = [
      ['Objetivo', 'Curadoria em massa da biblioteca global MASTER de Regras Exame × Risco (PcmsoExamRiskRule + PcmsoExamRiskRuleExam). NÃO aplica nada em empresas, ExamToRisk, PCMSO, Exam, RiskFactors, RiskSubType, Tabela 27 ou eSocial.'],
      ['Uma linha por exame', 'Cada linha = um exame sugerido da regra. Regra sem exame aparece com colunas de exame vazias. A regra se repete em cada linha dos seus exames.'],
      ['Âncoras', 'ruleId identifica a regra (read-only); ruleExamId identifica o exame (read-only). ruleExamId vazio com examId preenchido = novo exame na regra.'],
      ['Não cria regra nova', 'A importação NÃO cria regra nova (escopo/risco são read-only). Linha sem ruleId com dados é INVÁLIDA. Crie a regra pela tela e reimporte.'],
      ['Campos read-only', 'ruleId, ruleExamId, scope, source, sourceIndicatorId, referenceName, riskNameSnapshot, subTypeNameSnapshot, agentNameNormalized, examName, esocial27Code, procedureNameSnapshot. Alterações nessas colunas são IGNORADAS e sinalizadas como aviso.'],
      ['Campos editáveis (regra)', 'status; isCurated; rationale; agentName e agentCas (somente quando scope=AGENT).'],
      ['Campos editáveis (exame)', 'examId; validityInMonths; considerBetweenDays; collectionToleranceDays; collectionMoment; isMale; isFemale; isAdmission; isPeriodic; isChange; isReturn; isDismissal; fromAge; toAge; minRiskDegree; minRiskDegreeQuantity.'],
      ['examId', 'Deve existir no catálogo de exames system/global. Exame inexistente/não-system = REJEITADA.'],
      ['ACTIVE exige exame', 'status=ACTIVE só é permitido se a regra tiver ao menos um exame válido (examId válido). Caso contrário a linha é INVÁLIDA e não é aplicada.'],
      ['isCurated', 'Qualquer alteração via importação marca a regra como isCurated=true (protege regras NR-07 de sobrescrita por sync). Se a coluna vier preenchida, o valor é respeitado, mantida a proteção.'],
      ['esocial27Code / procedureNameSnapshot', 'Apenas INFORMATIVOS (read-only). Resolvidos de Exam.esocial27Code e da curadoria da Tabela 27. O vínculo formal será feito na Fase 4C.'],
      ['Prévia (dry-run)', 'A importação roda primeiro em PRÉVIA: valida, classifica (criar/atualizar/sem alteração/rejeitada/conflito/inválida) e NÃO grava nada.'],
      ['Conflito de regra', 'Se a mesma regra (ruleId) aparecer em linhas com valores divergentes nos campos de regra, todas as linhas viram CONFLITO e não são aplicadas.'],
      ['Soft-deleted', 'Âncora apontando para registro removido pode ser restaurada via importação; isso aparece como UPDATE/RESTORE na prévia (deleted_at vai a vazio).'],
      ['Aplicar', 'Só após confirmação explícita do MASTER. Idempotente: reaplicar a mesma planilha resulta em 0 gravações.'],
    ];
    rows.forEach((row) => sheet.addRow({ topic: row[0], description: row[1] }));
    sheet.getColumn('description').alignment = { wrapText: true, vertical: 'top' };
  }

  private addReferencesSheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet(SHEETS.REFERENCES);
    sheet.columns = [
      { header: 'Campo', key: 'field', width: 28 },
      { header: 'Valores válidos', key: 'values', width: 80 },
    ];
    sheet.getRow(1).font = { bold: true };
    Object.entries(EXAM_RISK_RULE_REFERENCE_VALUES).forEach(([field, values]) => {
      sheet.addRow({ field, values: values.join(', ') });
    });
    sheet.getColumn('values').alignment = { wrapText: true, vertical: 'top' };
  }

  private async toBuffer(workbook: ExcelJS.Workbook): Promise<Buffer> {
    const result = await workbook.xlsx.writeBuffer();
    return Buffer.from(result as ArrayBuffer);
  }
}
