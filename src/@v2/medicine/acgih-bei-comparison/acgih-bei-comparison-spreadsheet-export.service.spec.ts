import { describe, expect, it } from '@jest/globals';
import * as ExcelJS from 'exceljs';

import {
  AcgihBeiComparisonSpreadsheetExportService,
  excelMatchStatus,
  excelOptionalText,
  excelTechnicalDiff,
} from './acgih-bei-comparison-spreadsheet-export.service';
import {
  AcgihBeiComparisonStatus,
  AcgihBeiSuggestedAction,
  ComparisonResult,
  MatchStatus,
} from './acgih-bei-comparison.util';

const baseRow = (over: Partial<ComparisonResult> = {}): ComparisonResult => ({
  acgihBeiId: 'acgih-1',
  substanceName: 'Tolueno',
  cas: null,
  determinant: 'o-Cresol',
  biologicalMatrix: 'Urina',
  samplingTime: 'FJ',
  beiValue: null,
  unit: null,
  confidence: null,
  nr7MatchStatus: MatchStatus.NONE,
  nr7IndicatorId: null,
  nr7SubstanceName: null,
  nr7IndicatorName: null,
  examRiskRuleMatchStatus: MatchStatus.NONE,
  examRiskRuleId: null,
  examRiskRuleSource: null,
  examNameSnapshot: null,
  ruleMatchMethod: null,
  comparisonStatus: AcgihBeiComparisonStatus.NEW_CANDIDATE,
  suggestedAction: AcgihBeiSuggestedAction.CREATE_NEW_RULE_CANDIDATE,
  technicalDiff: '',
  reviewNotes: 'Sem equivalente claro.',
  ...over,
});

describe('excel export helpers', () => {
  it('excelOptionalText retorna null para vazio', () => {
    expect(excelOptionalText(null)).toBeNull();
    expect(excelOptionalText(undefined)).toBeNull();
    expect(excelOptionalText('')).toBeNull();
    expect(excelOptionalText('   ')).toBeNull();
    expect(excelOptionalText('108-88-3')).toBe('108-88-3');
  });

  it('excelMatchStatus mapeia NONE para Sem match', () => {
    expect(excelMatchStatus(MatchStatus.NONE)).toBe('Sem match');
    expect(excelMatchStatus(MatchStatus.FULL)).toBe('FULL');
  });

  it('excelTechnicalDiff omite string vazia', () => {
    expect(excelTechnicalDiff('')).toBeNull();
    expect(excelTechnicalDiff('  ')).toBeNull();
    expect(excelTechnicalDiff('valor diferente')).toBe('valor diferente');
  });
});

describe('AcgihBeiComparisonSpreadsheetExportService', () => {
  const service = new AcgihBeiComparisonSpreadsheetExportService();

  it('não grava shared string vazia nem valor 84 em campos sem match', async () => {
    const buffer = await service.export([
      baseRow(),
      baseRow({
        acgihBeiId: 'acgih-2',
        nr7MatchStatus: MatchStatus.FULL,
        nr7IndicatorId: 'nr7-1',
        nr7SubstanceName: 'Tolueno',
        nr7IndicatorName: 'o-Cresol',
        technicalDiff:
          'determinante: ACGIH "—" × NR-7 "o-Cresol"',
      }),
    ]);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

    const sheet = workbook.getWorksheet('ACGIH_BEI_Comparacao');
    expect(sheet).toBeTruthy();

    const colByHeader = new Map<string, number>();
    sheet!.getRow(1).eachCell((cell, col) => {
      colByHeader.set(String(cell.value), col);
    });

    const forbidden = new Set(['84', 'NONE', '∅', '']);

    for (let rowNum = 2; rowNum <= 3; rowNum++) {
      const row = sheet!.getRow(rowNum);
      row.eachCell({ includeEmpty: false }, (cell) => {
        const value = cell.value;
        if (value == null) return;
        const asString = String(value);
        expect(forbidden.has(asString)).toBe(false);
        expect(asString).not.toMatch(/^84$/);
      });
    }

    const row1 = sheet!.getRow(2);
    expect(row1.getCell(colByHeader.get('nr7MatchStatus')!).value).toBe(
      'Sem match',
    );
    expect(
      row1.getCell(colByHeader.get('examRiskRuleMatchStatus')!).value,
    ).toBe('Sem match');
    expect(row1.getCell(colByHeader.get('nr7IndicatorId')!).value).toBeNull();
    expect(row1.getCell(colByHeader.get('cas')!).value).toBeNull();
    expect(row1.getCell(colByHeader.get('beiValue')!).value).toBeNull();
    expect(row1.getCell(colByHeader.get('technicalDiff')!).value).toBeNull();
  });

  it('mantém abas ACGIH_BEI_Comparacao e Instruções', async () => {
    const buffer = await service.export([baseRow()]);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    expect(workbook.getWorksheet('ACGIH_BEI_Comparacao')).toBeTruthy();
    expect(workbook.getWorksheet('Instruções')).toBeTruthy();
  });
});
