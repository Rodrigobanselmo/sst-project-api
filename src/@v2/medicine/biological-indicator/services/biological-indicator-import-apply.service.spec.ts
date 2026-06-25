import { describe, expect, it } from '@jest/globals';
import * as XLSX from 'xlsx';

import { parsePreviewRow } from '../biological-indicator-preview.util';
import { BiologicalIndicatorImportApplyService } from './biological-indicator-import-apply.service';
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

const existingFromRow = (row: Row, id: string) => {
  const parsed = parsePreviewRow(row, 2, NORMATIVE_VERSION);
  return {
    id,
    ...parsed.payload!,
    substanceGroupId: null,
    status: 'DRAFT',
  };
};

type Capture = {
  batchCreates: any[];
  indicatorCreates: any[];
  indicatorUpdates: any[];
  riskUpdateMany: any[];
  examUpdateMany: any[];
};

const buildService = (existing: any[]) => {
  const capture: Capture = {
    batchCreates: [],
    indicatorCreates: [],
    indicatorUpdates: [],
    riskUpdateMany: [],
    examUpdateMany: [],
  };

  const tx = {
    biologicalIndicatorImportBatch: {
      create: async (args: any) => {
        capture.batchCreates.push(args);
        return { id: 'batch-1' };
      },
    },
    occupationalBiologicalIndicator: {
      create: async (args: any) => {
        capture.indicatorCreates.push(args);
        return { id: `new-${capture.indicatorCreates.length}` };
      },
      update: async (args: any) => {
        capture.indicatorUpdates.push(args);
        return { id: args.where.id };
      },
    },
    biologicalIndicatorToRisk: {
      updateMany: async (args: any) => {
        capture.riskUpdateMany.push(args);
        return { count: 1 };
      },
    },
    biologicalIndicatorToExam: {
      updateMany: async (args: any) => {
        capture.examUpdateMany.push(args);
        return { count: 1 };
      },
    },
  };

  const prisma = {
    occupationalBiologicalIndicator: {
      findMany: async () => existing,
    },
    $transaction: async (cb: any) => cb(tx),
  } as never;

  const previewService = new BiologicalIndicatorImportPreviewService(prisma);
  const service = new BiologicalIndicatorImportApplyService(
    prisma,
    previewService,
  );

  return { service, capture };
};

const run = (service: BiologicalIndicatorImportApplyService, rows: Row[]) =>
  service.apply({
    buffer: buildBuffer(rows),
    fileName: 'planilha.xlsx',
    normativeVersion: NORMATIVE_VERSION,
    userId: 42,
  });

describe('BiologicalIndicatorImportApplyService', () => {
  it('cria indicador NEW em DRAFT e registra batch APPLIED', async () => {
    const { service, capture } = buildService([]);

    const result = await run(service, [baseRow()]);

    expect(capture.batchCreates).toHaveLength(1);
    expect(capture.batchCreates[0].data.stats.mode).toBe('APPLIED');
    expect(capture.indicatorCreates).toHaveLength(1);
    expect(capture.indicatorCreates[0].data.status).toBe('DRAFT');
    expect(result.applied.new).toBe(1);
    expect(result.batchId).toBe('batch-1');
  });

  it('UPDATED rebaixa para DRAFT, limpa revisão e grava nota de revalidação', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1' };
    const existing = {
      ...existingFromRow(row, 'ind-1'),
      unit: 'unidade-antiga',
      status: 'ACTIVE',
    };
    const { service, capture } = buildService([existing]);

    const result = await run(service, [row]);

    expect(result.applied.updated).toBe(1);
    const update = capture.indicatorUpdates.find(
      (u) => u.where.id === 'ind-1',
    );
    expect(update.data.status).toBe('DRAFT');
    expect(update.data.reviewedById).toBeNull();
    expect(update.data.reviewedAt).toBeNull();
    expect(update.data.reviewNotes).toContain('Revalidação exigida');
    expect(update.data.reviewNotes).toContain('unit');
  });

  it('UPDATED com mudança de matriz/valor sinaliza vínculos de exame para recuradoria', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1', Unidade: 'mg/L' };
    const existing = { ...existingFromRow(row, 'ind-1'), unit: 'mg/g' };
    const { service, capture } = buildService([existing]);

    const result = await run(service, [row]);

    expect(capture.examUpdateMany).toHaveLength(1);
    expect(capture.examUpdateMany[0].data).toEqual({
      requiresReview: true,
      isConfirmed: false,
    });
    expect(result.applied.examLinksFlagged).toBe(1);
    expect(capture.riskUpdateMany).toHaveLength(0);
  });

  it('UPDATED com mudança de CAS sinaliza vínculos de risco para recuradoria', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1', CAS: '71-43-2' };
    const existing = {
      ...existingFromRow(row, 'ind-1'),
      casNumbers: ['100-00-0'],
      casPrimary: '100-00-0',
    };
    const { service, capture } = buildService([existing]);

    const result = await run(service, [row]);

    expect(capture.riskUpdateMany).toHaveLength(1);
    expect(result.applied.riskLinksFlagged).toBe(1);
  });

  it('DEPRECATED_CANDIDATE marca indicador como DEPRECATED sem apagar', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1' };
    const present = existingFromRow(row, 'ind-1');
    const orphan = {
      ...existingFromRow(baseRow(), 'ind-orphan'),
      substanceName: 'Tolueno',
    };
    const { service, capture } = buildService([present, orphan]);

    const result = await run(service, [row]);

    const deprecated = capture.indicatorUpdates.find(
      (u) => u.where.id === 'ind-orphan',
    );
    expect(deprecated.data.status).toBe('DEPRECATED');
    expect(result.applied.deprecated).toBe(1);
  });

  it('bloqueia apply quando há linha INVALID', async () => {
    const { service, capture } = buildService([]);
    const invalid = { ...baseRow(), Substância: '' };

    await expect(run(service, [invalid])).rejects.toThrow();
    expect(capture.batchCreates).toHaveLength(0);
    expect(capture.indicatorCreates).toHaveLength(0);
  });

  it('bloqueia apply quando há linha CONFLICT', async () => {
    const row1 = { ...baseRow(), indicatorId: 'dup' };
    const row2 = { ...baseRow(), indicatorId: 'dup' };
    const { service, capture } = buildService([existingFromRow(row1, 'dup')]);

    await expect(run(service, [row1, row2])).rejects.toThrow();
    expect(capture.batchCreates).toHaveLength(0);
  });

  it('bloqueia apply quando não há alterações aplicáveis', async () => {
    const row = { ...baseRow(), indicatorId: 'ind-1' };
    const existing = existingFromRow(row, 'ind-1');
    const { service, capture } = buildService([existing]);

    await expect(run(service, [row])).rejects.toThrow(
      'Nenhuma alteração aplicável',
    );
    expect(capture.batchCreates).toHaveLength(0);
  });
});
