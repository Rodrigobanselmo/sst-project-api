import { describe, expect, it, jest } from '@jest/globals';
import {
  PcmsoAcgihBeiIndicator,
  PcmsoAcgihBeiIndicatorConfidenceEnum,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
} from '@prisma/client';
import * as XLSX from 'xlsx';

import { buildDedupeKey, normalizeText } from './acgih-bei-indicator-import.util';
import {
  AcgihBeiIndicatorImportPreviewService,
} from './acgih-bei-indicator-import-preview.service';
import { AcgihBeiIndicatorRepository } from './acgih-bei-indicator.repository';

const SHEET = 'ACGIH_BEI_Curadoria';

const buildBuffer = (rows: Record<string, unknown>[]): Buffer => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};

const makeRecord = (
  over: Partial<PcmsoAcgihBeiIndicator> & { substanceName: string },
): PcmsoAcgihBeiIndicator => {
  const dedupeKey = buildDedupeKey({
    substanceName: over.substanceName,
    cas: over.cas ?? null,
    determinant: over.determinant ?? null,
    biologicalMatrix: over.biologicalMatrix ?? null,
    samplingTime: over.samplingTime ?? null,
  });
  return {
    id: over.id ?? 'rec-1',
    substanceName: over.substanceName,
    substanceNameNormalized: normalizeText(over.substanceName),
    cas: over.cas ?? null,
    referenceYear: over.referenceYear ?? null,
    determinant: over.determinant ?? null,
    biologicalMatrix: over.biologicalMatrix ?? null,
    samplingTime: over.samplingTime ?? null,
    beiValue: over.beiValue ?? null,
    unit: over.unit ?? null,
    notation: over.notation ?? null,
    status: over.status ?? PcmsoAcgihBeiIndicatorStatusEnum.DRAFT,
    source: over.source ?? PcmsoAcgihBeiIndicatorSourceEnum.ACGIH_BEI,
    sourceYear: over.sourceYear ?? null,
    isCurated: over.isCurated ?? false,
    confidence: over.confidence ?? null,
    internalNotes: over.internalNotes ?? null,
    sourcePage: over.sourcePage ?? null,
    dedupeKey: over.dedupeKey ?? dedupeKey,
    createdById: null,
    updatedById: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: over.deleted_at ?? null,
  };
};

describe('AcgihBeiIndicatorImportPreviewService', () => {
  const makeService = (records: {
    byIds?: PcmsoAcgihBeiIndicator[];
    byDedupe?: PcmsoAcgihBeiIndicator[];
  }) => {
    const repository = {
      findByIdsRaw: jest.fn(() => Promise.resolve(records.byIds ?? [])),
      findByDedupeKeys: jest.fn(() => Promise.resolve(records.byDedupe ?? [])),
    } as unknown as AcgihBeiIndicatorRepository;
    return new AcgihBeiIndicatorImportPreviewService(repository);
  };

  it('classifica CREATE para nova substância sem id', async () => {
    const service = makeService({});
    const buffer = buildBuffer([
      { id: '', substanceName: 'Tolueno', cas: '108-88-3', status: 'DRAFT' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.create).toBe(1);
    expect(result.lines[0].classification).toBe('CREATE');
  });

  it('classifica UPDATE quando dedupeKey existe e há diferença', async () => {
    const existing = makeRecord({
      id: 'rec-1',
      substanceName: 'Tolueno',
      cas: '108-88-3',
      status: PcmsoAcgihBeiIndicatorStatusEnum.DRAFT,
    });
    const service = makeService({ byDedupe: [existing] });
    const buffer = buildBuffer([
      { id: '', substanceName: 'Tolueno', cas: '108-88-3', status: 'ACTIVE' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.update).toBe(1);
    expect(result.lines[0].changedFields).toContain('status');
  });

  it('classifica UNCHANGED quando idêntico (idempotência por id)', async () => {
    const existing = makeRecord({
      id: 'rec-1',
      substanceName: 'Tolueno',
      cas: '108-88-3',
      status: PcmsoAcgihBeiIndicatorStatusEnum.ACTIVE,
      confidence: PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
    });
    const service = makeService({ byIds: [existing], byDedupe: [existing] });
    const buffer = buildBuffer([
      {
        id: 'rec-1',
        substanceName: 'Tolueno',
        cas: '108-88-3',
        status: 'ACTIVE',
        confidence: 'HIGH',
      },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.unchanged).toBe(1);
    expect(result.lines[0].classification).toBe('UNCHANGED');
  });

  it('classifica REJECTED quando id não existe', async () => {
    const service = makeService({ byIds: [] });
    const buffer = buildBuffer([
      { id: 'nope', substanceName: 'Tolueno', status: 'DRAFT' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.rejected).toBe(1);
    expect(result.lines[0].classification).toBe('REJECTED');
  });

  it('classifica INVALID para status inválido', async () => {
    const service = makeService({});
    const buffer = buildBuffer([
      { id: '', substanceName: 'Tolueno', status: 'FOO' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.invalid).toBe(1);
  });

  it('classifica CONFLICT para chave natural duplicada na planilha', async () => {
    const service = makeService({});
    const buffer = buildBuffer([
      { id: '', substanceName: 'Tolueno', cas: '108-88-3', status: 'DRAFT' },
      { id: '', substanceName: 'Tolueno', cas: '108-88-3', status: 'ACTIVE' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.conflict).toBe(2);
  });

  it('linha vazia é UNCHANGED e não gera escrita', async () => {
    const service = makeService({});
    const buffer = buildBuffer([{ id: '', substanceName: '' }]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.unchanged).toBe(1);
    expect(result.totals.create).toBe(0);
  });

  it('restaura soft-deleted via dedupeKey → UPDATE com restored', async () => {
    const existing = makeRecord({
      id: 'rec-1',
      substanceName: 'Tolueno',
      cas: '108-88-3',
      status: PcmsoAcgihBeiIndicatorStatusEnum.DRAFT,
      deleted_at: new Date(),
    });
    const service = makeService({ byDedupe: [existing] });
    const buffer = buildBuffer([
      { id: '', substanceName: 'Tolueno', cas: '108-88-3', status: 'DRAFT' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.lines[0].classification).toBe('UPDATE');
    expect(result.lines[0].restored).toBe(true);
  });
});
