import { describe, expect, it } from '@jest/globals';
import * as XLSX from 'xlsx';

import { BiologicalIndicatorSpreadsheetExportService } from './biological-indicator-spreadsheet-export.service';

const SHEETS = ['Indicadores_NR07_AnexoI', 'Instruções', 'Referências'];

const sampleIndicator = {
  id: 'ind-1',
  idempotencyKey: 'key-1',
  normativeSource: 'NR_07',
  normativeVersion: 'NR-07-2022',
  annex: 'ANNEX_I',
  status: 'DRAFT',
  substanceName: 'Benzeno',
  casNumbers: ['71-43-2'],
  isSubstanceGroup: false,
  tableNumber: 'QUADRO_1',
  indicatorType: 'IBE_EE',
  biologicalIndicatorOriginal: 'Ácido S-fenilmercaptúrico',
  biologicalIndicatorNormalized: 'acido s fenilmercapturico',
  biologicalMatrix: 'Urina',
  collectionMoment: 'FJ',
  referenceValueRaw: '0,5',
  referenceValue: '0.5',
  unit: 'mg/g',
  technicalObservationsRaw: 'NE',
  generalApplicabilityNotes: null,
  defaultValidityMonths: 6,
  collectionToleranceDays: 45,
  requiresNormativeReview: false,
  reviewNotes: null,
  reviewedAt: null,
  substanceGroup: null,
  reviewedBy: null,
  riskLinks: [
    { isConfirmed: true, isPrimary: true, riskNameSnapshot: 'Benzeno' },
  ],
  examLinks: [
    { isConfirmed: true, isDefault: true, examNameSnapshot: 'Ácido S-fenilmercaptúrico (urina)' },
  ],
};

const buildService = (indicators: unknown[]) => {
  const prisma = {
    occupationalBiologicalIndicator: {
      findMany: async () => indicators,
    },
  } as never;
  return new BiologicalIndicatorSpreadsheetExportService(prisma);
};

describe('BiologicalIndicatorSpreadsheetExportService', () => {
  it('exporta base atual com 3 abas e linha de dados', async () => {
    const service = buildService([sampleIndicator]);
    const buffer = await service.exportCurrentBase();

    const wb = XLSX.read(buffer, { type: 'buffer' });
    SHEETS.forEach((name) => expect(wb.SheetNames).toContain(name));

    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(
      wb.Sheets['Indicadores_NR07_AnexoI'],
      { defval: null, raw: false },
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].indicatorId).toBe('ind-1');
    expect(rows[0].Substância).toBe('Benzeno');
    expect(rows[0].Quadro).toBe('Quadro 1');
    expect(rows[0]['Tipo indicador']).toBe('IBE/EE');
  });

  it('gera modelo vazio com 3 abas e sem linhas de dados', async () => {
    const service = buildService([]);
    const buffer = await service.buildTemplate();

    const wb = XLSX.read(buffer, { type: 'buffer' });
    SHEETS.forEach((name) => expect(wb.SheetNames).toContain(name));

    const rows = XLSX.utils.sheet_to_json(
      wb.Sheets['Indicadores_NR07_AnexoI'],
    );
    expect(rows).toHaveLength(0);
  });
});
