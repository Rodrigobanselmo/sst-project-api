import { Injectable } from '@nestjs/common';
import { PcmsoAcgihBeiComparisonDecisionEnum } from '@prisma/client';
import * as ExcelJS from 'exceljs';

import {
  ACGIH_BEI_COMPARISON_COLUMN_HEADERS,
  ACGIH_BEI_COMPARISON_COLUMN_ORDER,
  ACGIH_BEI_COMPARISON_COLUMN_WIDTHS,
  ACGIH_BEI_COMPARISON_SHEET_NAMES as SHEETS,
} from './acgih-bei-comparison-spreadsheet.constants';
import {
  AcgihBeiOperationalStatus,
  ComparisonResult,
  MatchStatus,
} from './acgih-bei-comparison.util';

/** Célula opcional: null omite a célula no XLSX (evita shared string vazio). */
export const excelOptionalText = (value?: string | null): string | null => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/** Status de match legível na planilha. */
export const excelMatchStatus = (status: MatchStatus): string =>
  status === MatchStatus.NONE ? 'Sem match' : status;

/** Diferenças técnicas: omitir quando vazio. */
export const excelTechnicalDiff = (value?: string | null): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed;
};

/** Booleano opcional legível: true → "Sim", false → "Não", null/undefined → null. */
export const excelOptionalBoolean = (
  value?: boolean | null,
): string | null => {
  if (value == null) return null;
  return value ? 'Sim' : 'Não';
};

/** 4O.3/4O.4 — rótulos legíveis do status operacional/efetivo para o Excel. */
export const COMPARISON_OPERATIONAL_STATUS_LABELS: Record<
  AcgihBeiOperationalStatus,
  string
> = {
  ALREADY_COVERED: 'Já coberto',
  DIVERGENT: 'Divergente',
  NEEDS_REVIEW: 'Requer revisão',
  NEW_CANDIDATE: 'Candidato novo',
  LOW_CONFIDENCE_REVIEW: 'Baixa confiança',
  RESOLVED_EQUIVALENCE: 'Resolvido por equivalência técnica',
  // 4O.4 — estados operacionais derivados da decisão técnica em linhas revisadas.
  REAL_DIVERGENCE: 'Divergência técnica real',
  SOURCE_ACGIH_ERROR: 'Erro na base ACGIH/BEI',
  SOURCE_NR7_ERROR: 'Erro na base NR-7',
  NEEDS_FURTHER_REVIEW: 'Pendente de revisão (decisão)',
  IGNORE_MONITOR: 'Monitorar / ignorar',
  // 4O.5 — desfechos de auditoria para itens sem divergência.
  COVERAGE_CONFIRMED: 'Cobertura confirmada',
  ACGIH_CANDIDATE_CONFIRMED: 'Candidato ACGIH confirmado',
};

/** 4O.1 — rótulos legíveis das decisões técnicas para o Excel. */
export const COMPARISON_DECISION_LABELS: Record<
  PcmsoAcgihBeiComparisonDecisionEnum,
  string
> = {
  FALSE_DIVERGENCE_EQUIVALENT: 'Equivalência técnica / falso divergente',
  REAL_DIVERGENCE: 'Divergência técnica real',
  SOURCE_ACGIH_ERROR: 'Erro na base ACGIH/BEI',
  SOURCE_NR7_ERROR: 'Erro na base NR-7',
  NEEDS_FURTHER_REVIEW: 'Pendente de revisão',
  IGNORE_MONITOR: 'Monitorar / ignorar',
  // 4O.5 — desfechos de auditoria para itens sem divergência.
  MATCH_CONFIRMED: 'Cobertura confirmada',
  NO_MATCH_CONFIRMED: 'Candidato ACGIH confirmado',
};

@Injectable()
export class AcgihBeiComparisonSpreadsheetExportService {
  /** Exporta o resultado da comparação (read-only). Não grava nada no banco. */
  async export(rows: ComparisonResult[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SimpleSST';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(SHEETS.DATA);
    sheet.columns = ACGIH_BEI_COMPARISON_COLUMN_ORDER.map((key) => ({
      header: ACGIH_BEI_COMPARISON_COLUMN_HEADERS[key] ?? key,
      key,
      width: ACGIH_BEI_COMPARISON_COLUMN_WIDTHS[key],
    }));
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    rows.forEach((row) => {
      sheet.addRow(this.toExportRow(row));
    });

    this.addInstructionsSheet(workbook);

    const result = await workbook.xlsx.writeBuffer();
    return Buffer.from(result as ArrayBuffer);
  }

  private toExportRow(row: ComparisonResult): Record<string, string | null> {
    return {
      acgihBeiId: row.acgihBeiId,
      substanceName: row.substanceName,
      cas: excelOptionalText(row.cas),
      determinant: excelOptionalText(row.determinant),
      biologicalMatrix: excelOptionalText(row.biologicalMatrix),
      samplingTime: excelOptionalText(row.samplingTime),
      beiValue: excelOptionalText(row.beiValue),
      unit: excelOptionalText(row.unit),
      confidence: row.confidence ?? null,
      nr7MatchStatus: excelMatchStatus(row.nr7MatchStatus),
      nr7IndicatorId: excelOptionalText(row.nr7IndicatorId),
      nr7SubstanceName: excelOptionalText(row.nr7SubstanceName),
      nr7IndicatorName: excelOptionalText(row.nr7IndicatorName),
      examRiskRuleMatchStatus: excelMatchStatus(row.examRiskRuleMatchStatus),
      examRiskRuleId: excelOptionalText(row.examRiskRuleId),
      examNameSnapshot: excelOptionalText(row.examNameSnapshot),
      comparisonStatus: row.comparisonStatus,
      // 4O.3 — status operacional/efetivo (comparisonStatus bruto preservado acima).
      operationalStatus: row.operationalStatus
        ? COMPARISON_OPERATIONAL_STATUS_LABELS[row.operationalStatus] ??
          row.operationalStatus
        : COMPARISON_OPERATIONAL_STATUS_LABELS[
            row.comparisonStatus as unknown as AcgihBeiOperationalStatus
          ] ?? row.comparisonStatus,
      suggestedAction: row.suggestedAction,
      technicalDiff: excelTechnicalDiff(row.technicalDiff),
      reviewNotes: excelOptionalText(row.reviewNotes),
      // 4L.1a — contexto/readiness (read-only).
      acgihBeiStatus: excelOptionalText(row.acgihBeiStatus),
      acgihBeiIsCurated: excelOptionalBoolean(row.acgihBeiIsCurated),
      acgihBeiSourceYear:
        row.acgihBeiSourceYear != null ? String(row.acgihBeiSourceYear) : null,
      acgihBeiSourcePage: excelOptionalText(row.acgihBeiSourcePage),
      nr7Status: excelOptionalText(row.nr7Status),
      nr7PendencyCount:
        row.nr7PendencyCount != null ? String(row.nr7PendencyCount) : null,
      nr7PendencyCodes: excelOptionalText(
        row.nr7PendencyCodes?.length ? row.nr7PendencyCodes.join(', ') : null,
      ),
      examRiskRuleStatus: excelOptionalText(row.examRiskRuleStatus),
      examRiskRuleIsCurated: excelOptionalBoolean(row.examRiskRuleIsCurated),
      hasComplementaryReference: row.hasComplementaryReference ? 'Sim' : null,
      // 4O.1 — decisão técnica de curadoria.
      reviewDecision: row.review
        ? COMPARISON_DECISION_LABELS[row.review.decision] ?? row.review.decision
        : null,
      reviewTechnicalNote: excelOptionalText(row.review?.technicalNote),
      reviewReviewedBy: excelOptionalText(row.review?.reviewedByName),
      reviewReviewedAt: row.review?.reviewedAt
        ? new Date(row.review.reviewedAt).toLocaleString('pt-BR')
        : null,
      reviewIsStale: row.review ? excelOptionalBoolean(row.review.isStale) : null,
    };
  }

  private addInstructionsSheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet(SHEETS.INSTRUCTIONS);
    sheet.columns = [
      { header: 'Tópico', key: 'topic', width: 32 },
      { header: 'Descrição', key: 'description', width: 100 },
    ];
    sheet.getRow(1).font = { bold: true };

    const rows: Array<[string, string]> = [
      ['Objetivo', 'Comparação técnica entre a base ACGIH/BEI e a base NR-7 e a biblioteca Regras Exame × Risco. Esta planilha é APENAS LEITURA (diagnóstica). Nada é aplicado, criado ou alterado.'],
      ['Não é importável', 'Esta exportação não tem fluxo de importação/aplicação. É um relatório de comparação.'],
      ['comparisonStatus', 'ALREADY_COVERED (ACGIH confirma NR-7/regra existente); DIVERGENT (mesmo determinante, diferença técnica relevante); NEEDS_REVIEW (correspondência parcial/ambígua); NEW_CANDIDATE (sem equivalente claro); LOW_CONFIDENCE_REVIEW (transcrição duvidosa). Status BRUTO calculado — nunca alterado pela curadoria.'],
      ['Status operacional (4O.3/4O.4/4O.5)', 'Classificação efetiva derivada do comparisonStatus + decisão técnica. Uma linha DIVERGENT marcada como "Equivalência técnica / falso divergente" passa a "Resolvido por equivalência técnica" e sai da fila de divergentes. Uma linha "Requer revisão" que recebe qualquer decisão técnica fresca passa a refletir essa decisão (ex.: Divergência técnica real, Erro ACGIH/BEI, Erro NR-7, Pendente de revisão, Monitorar/ignorar) e sai da fila de pendentes. Decisões de auditoria "Cobertura confirmada" e "Candidato ACGIH confirmado" passam a "Cobertura confirmada"/"Candidato ACGIH confirmado" em qualquer status e tiram o item da condição "sem decisão". Decisões desatualizadas (recalculadas) não colapsam o status. O comparisonStatus bruto permanece preservado nesta planilha para auditoria.'],
      ['suggestedAction', 'ADD_REFERENCE_ONLY (sugerir fonte complementar à regra existente; NÃO criar regra); REVIEW_DIVERGENCE; CREATE_NEW_RULE_CANDIDATE (possível regra nova, não criada nesta fase); IGNORE_OR_MONITOR; LOW_CONFIDENCE_REVIEW.'],
      ['nr7MatchStatus / examRiskRuleMatchStatus', 'FULL, PARTIAL ou Sem match (quando não há correspondência).'],
      ['Enriquecimento de fonte', 'Quando ACGIH confirma uma regra NR-7 existente, a sugestão é ADD_REFERENCE_ONLY: futuramente a regra poderá exibir "NR-7 + ACGIH/BEI". A gravação dessa referência NÃO ocorre nesta fase.'],
      ['Critérios de match NR-7', 'Âncora por CAS (casPrimary/casNumbers) ou nome normalizado; equivalência de determinante, matriz biológica e momento de coleta; comparação tolerante de valor/unidade.'],
      ['Critérios de match Regra', 'Por proveniência (regra NR_07 cujo sourceIndicatorId aponta ao indicador NR-7 correspondente) ou por agente (agentCas/agentName).'],
      ['Contexto/readiness (4L)', 'Colunas de apoio à revisão (read-only): Status/Curado/Ano/Página ACGIH/BEI; Status e Pendências NR-7; Status/Curada da regra da Biblioteca; e se a fonte complementar já está registrada. Não alteram a classificação nem a elegibilidade.'],
      ['Pendências NR-7', 'Reaproveitam a mesma lógica de pendências de ativação da curadoria NR-7 (ex.: RISK_NOT_CONFIRMED, EXAM_NOT_CONFIRMED, NORMATIVE_REVIEW_REQUIRED). Quantidade e códigos são informativos.'],
      ['Decisão técnica (4O.1/4O.5)', 'Camada de curadoria humana sobre a comparação. Valores: Equivalência técnica / falso divergente; Divergência técnica real; Erro na base ACGIH/BEI; Erro na base NR-7; Pendente de revisão; Monitorar / ignorar; Cobertura confirmada (match pleno / já coberto, sem criar item novo); Candidato ACGIH confirmado (sem match real, encaminhar para fase 4P). Registrar decisão NÃO altera o comparisonStatus calculado nem as bases NR-7/ACGIH/BEI/Biblioteca.'],
      ['Decisão desatualizada', 'Marcada quando o comparisonStatus recalculado difere do status registrado no momento da decisão (a decisão antiga é apenas sinalizada, nunca apagada).'],
    ];
    rows.forEach((row) => sheet.addRow({ topic: row[0], description: row[1] }));
    sheet.getColumn('description').alignment = { wrapText: true, vertical: 'top' };
  }
}
