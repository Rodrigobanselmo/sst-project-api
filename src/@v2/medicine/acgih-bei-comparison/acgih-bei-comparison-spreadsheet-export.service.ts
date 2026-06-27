import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

import {
  ACGIH_BEI_COMPARISON_COLUMN_ORDER,
  ACGIH_BEI_COMPARISON_COLUMN_WIDTHS,
  ACGIH_BEI_COMPARISON_SHEET_NAMES as SHEETS,
} from './acgih-bei-comparison-spreadsheet.constants';
import {
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

@Injectable()
export class AcgihBeiComparisonSpreadsheetExportService {
  /** Exporta o resultado da comparação (read-only). Não grava nada no banco. */
  async export(rows: ComparisonResult[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SimpleSST';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(SHEETS.DATA);
    sheet.columns = ACGIH_BEI_COMPARISON_COLUMN_ORDER.map((key) => ({
      header: key,
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
      suggestedAction: row.suggestedAction,
      technicalDiff: excelTechnicalDiff(row.technicalDiff),
      reviewNotes: excelOptionalText(row.reviewNotes),
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
      ['comparisonStatus', 'ALREADY_COVERED (ACGIH confirma NR-7/regra existente); DIVERGENT (mesmo determinante, diferença técnica relevante); NEEDS_REVIEW (correspondência parcial/ambígua); NEW_CANDIDATE (sem equivalente claro); LOW_CONFIDENCE_REVIEW (transcrição duvidosa).'],
      ['suggestedAction', 'ADD_REFERENCE_ONLY (sugerir fonte complementar à regra existente; NÃO criar regra); REVIEW_DIVERGENCE; CREATE_NEW_RULE_CANDIDATE (possível regra nova, não criada nesta fase); IGNORE_OR_MONITOR; LOW_CONFIDENCE_REVIEW.'],
      ['nr7MatchStatus / examRiskRuleMatchStatus', 'FULL, PARTIAL ou Sem match (quando não há correspondência).'],
      ['Enriquecimento de fonte', 'Quando ACGIH confirma uma regra NR-7 existente, a sugestão é ADD_REFERENCE_ONLY: futuramente a regra poderá exibir "NR-7 + ACGIH/BEI". A gravação dessa referência NÃO ocorre nesta fase.'],
      ['Critérios de match NR-7', 'Âncora por CAS (casPrimary/casNumbers) ou nome normalizado; equivalência de determinante, matriz biológica e momento de coleta; comparação tolerante de valor/unidade.'],
      ['Critérios de match Regra', 'Por proveniência (regra NR_07 cujo sourceIndicatorId aponta ao indicador NR-7 correspondente) ou por agente (agentCas/agentName).'],
    ];
    rows.forEach((row) => sheet.addRow({ topic: row[0], description: row[1] }));
    sheet.getColumn('description').alignment = { wrapText: true, vertical: 'top' };
  }
}
