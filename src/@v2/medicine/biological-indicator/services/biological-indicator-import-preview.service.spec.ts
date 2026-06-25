import { describe, expect, it } from '@jest/globals';
import * as XLSX from 'xlsx';

import { parsePreviewRow } from '../biological-indicator-preview.util';
import { BiologicalIndicatorImportPreviewService } from './biological-indicator-import-preview.service';

const NORMATIVE_VERSION = 'NR-07-2022';
const SHEET = 'Indicadores_NR07_AnexoI';

type Row = Record<string, string>;

const baseRow = (): Row => ({
  indicatorId: '',
  idempotencyKey: '',
  statusAtual: 'DRAFT',
  Substância: 'Benzeno',
  CAS: '71-43-2',
  Quadro: 'Quadro 1',
  'Tipo indicador': 'IBE/EE',
  'Indicador biológico (original)': 'Ácido S-fenilmercaptúrico',
  'Material biológico / matriz': 'Urina',
  'Momento da coleta': 'FJ',
  Valor: '0,5',
  Unidade: 'mg/g',
  'Observações NR-07': 'NE',
  requiresNormativeReview: 'false',
});

const buildBuffer = (rows: Row[]): Buffer => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};

/** Builds a DB-shaped existing record matching a sheet row (so diff = empty). */
const existingFromRow = (row: Row, id: string) => {
  const parsed = parsePreviewRow(row, 2, NORMATIVE_VERSION);
  return { id, ...parsed.payload!, substanceGroupId: null };
};

const buildService = (existing: unknown[]) => {
  const prisma = {
    occupationalBiologicalIndicator: {
      findMany: async () => existing,
    },
  } as never;
  return new BiologicalIndicatorImportPreviewService(prisma);
};

describe('BiologicalIndicatorImportPreviewService', () => {
  it('classifica linha sem âncora e sem match como NEW', async () => {
    const row = baseRow();
    const service = buildService([]);

    const result = await service.preview({
      buffer: buildBuffer([row]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    const line = result.lines.find((l) => l.rowNumber === 2);
    expect(line?.classification).toBe('NEW');
    expect(result.totals.new).toBe(1);
  });

  it('classifica como UNCHANGED quando indicatorId casa e nada muda', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1' };
    const existing = existingFromRow(row, 'ind-1');
    const service = buildService([existing]);

    const result = await service.preview({
      buffer: buildBuffer([row]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    const line = result.lines.find((l) => l.rowNumber === 2);
    expect(line?.classification).toBe('UNCHANGED');
    expect(line?.anchorUsed).toBe('indicatorId');
    expect(result.totals.unchanged).toBe(1);
  });

  it('classifica como UPDATED quando há mudança normativa', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1' };
    const existing = { ...existingFromRow(row, 'ind-1'), unit: 'unidade-antiga' };
    const service = buildService([existing]);

    const result = await service.preview({
      buffer: buildBuffer([row]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    const line = result.lines.find((l) => l.rowNumber === 2);
    expect(line?.classification).toBe('UPDATED');
    expect(line?.changedFields).toContain('unit');

    const change = line?.fieldChanges.find((c) => c.field === 'unit');
    expect(change?.from).toBe('unidade-antiga');
    expect(change?.to).toBe('mg/g');
  });

  it('não marca UPDATED por diferença apenas em campos derivados (casPrimary/referenceValue)', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1' };
    const existing = {
      ...existingFromRow(row, 'ind-1'),
      // Derived fields divergent from source fields — must be ignored in diff.
      casPrimary: 'valor-derivado-antigo',
      referenceValue: 'normalizado-antigo',
    };
    const service = buildService([existing]);

    const result = await service.preview({
      buffer: buildBuffer([row]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    const line = result.lines.find((l) => l.rowNumber === 2);
    expect(line?.classification).toBe('UNCHANGED');
    expect(line?.changedFields).not.toContain('casPrimary');
    expect(line?.changedFields).not.toContain('referenceValue');
  });

  it('classifica indicador do banco ausente como DEPRECATED_CANDIDATE', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1' };
    const present = existingFromRow(row, 'ind-1');
    const orphan = { ...existingFromRow(baseRow(), 'ind-orphan'), substanceName: 'Tolueno' };
    const service = buildService([present, orphan]);

    const result = await service.preview({
      buffer: buildBuffer([row]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    expect(result.totals.deprecatedCandidate).toBe(1);
    expect(result.deprecatedCandidates[0].indicatorId).toBe('ind-orphan');
  });

  it('classifica indicatorId inexistente como CONFLICT', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-missing' };
    const service = buildService([]);

    const result = await service.preview({
      buffer: buildBuffer([row]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    const line = result.lines.find((l) => l.rowNumber === 2);
    expect(line?.classification).toBe('CONFLICT');
    expect(result.totals.conflict).toBe(1);
  });

  it('classifica linha incompleta como INVALID sem interromper', async () => {
    const invalid = { ...baseRow(), Substância: '' };
    const valid = baseRow();
    const service = buildService([]);

    const result = await service.preview({
      buffer: buildBuffer([invalid, valid]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    expect(result.totals.invalid).toBe(1);
    expect(result.totals.read).toBe(2);
    expect(result.lines.find((l) => l.rowNumber === 2)?.classification).toBe(
      'INVALID',
    );
  });

  it('detecta indicatorId duplicado na planilha como CONFLICT', async () => {
    const row1 = { ...baseRow(), indicatorId: 'dup' };
    const row2 = { ...baseRow(), indicatorId: 'dup' };
    const service = buildService([existingFromRow(row1, 'dup')]);

    const result = await service.preview({
      buffer: buildBuffer([row1, row2]),
      fileName: 'planilha.xlsx',
      normativeVersion: NORMATIVE_VERSION,
    });

    expect(result.totals.conflict).toBe(2);
  });
});
