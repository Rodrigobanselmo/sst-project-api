import { describe, expect, it, jest } from '@jest/globals';
import {
  PcmsoAcgihBeiIndicator,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
} from '@prisma/client';
import * as XLSX from 'xlsx';

import { buildDedupeKey, normalizeText } from './acgih-bei-indicator-import.util';
import { AcgihBeiIndicatorImportApplyService } from './acgih-bei-indicator-import-apply.service';
import { AcgihBeiIndicatorImportPreviewService } from './acgih-bei-indicator-import-preview.service';
import {
  AcgihBeiImportUpsertItem,
  AcgihBeiIndicatorRepository,
} from './acgih-bei-indicator.repository';

const SHEET = 'ACGIH_BEI_Curadoria';

const buildBuffer = (rows: Record<string, unknown>[]): Buffer => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};

const makeRecord = (
  over: Partial<PcmsoAcgihBeiIndicator> & { substanceName: string },
): PcmsoAcgihBeiIndicator => ({
  id: over.id ?? 'rec-1',
  substanceName: over.substanceName,
  substanceNameNormalized: normalizeText(over.substanceName),
  cas: over.cas ?? null,
  referenceYear: null,
  determinant: over.determinant ?? null,
  biologicalMatrix: over.biologicalMatrix ?? null,
  samplingTime: over.samplingTime ?? null,
  beiValue: null,
  unit: null,
  notation: null,
  status: over.status ?? PcmsoAcgihBeiIndicatorStatusEnum.DRAFT,
  source: PcmsoAcgihBeiIndicatorSourceEnum.ACGIH_BEI,
  sourceYear: null,
  isCurated: over.isCurated ?? false,
  confidence: over.confidence ?? null,
  internalNotes: null,
  sourcePage: null,
  dedupeKey:
    over.dedupeKey ??
    buildDedupeKey({
      substanceName: over.substanceName,
      cas: over.cas ?? null,
      determinant: over.determinant ?? null,
      biologicalMatrix: over.biologicalMatrix ?? null,
      samplingTime: over.samplingTime ?? null,
    }),
  createdById: null,
  updatedById: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: over.deleted_at ?? null,
});

describe('AcgihBeiIndicatorImportApplyService', () => {
  const makeServices = (records: {
    byIds?: PcmsoAcgihBeiIndicator[];
    byDedupe?: PcmsoAcgihBeiIndicator[];
  }) => {
    const applyImportUpsertBatch = jest.fn(
      (_items: AcgihBeiImportUpsertItem[]) => Promise.resolve(undefined),
    );
    const repository = {
      findByIdsRaw: jest.fn(() => Promise.resolve(records.byIds ?? [])),
      findByDedupeKeys: jest.fn(() => Promise.resolve(records.byDedupe ?? [])),
      applyImportUpsertBatch,
    } as unknown as AcgihBeiIndicatorRepository;
    const preview = new AcgihBeiIndicatorImportPreviewService(repository);
    const service = new AcgihBeiIndicatorImportApplyService(repository, preview);
    return { service, applyImportUpsertBatch };
  };

  it('aplica CREATE e chama upsert transacional com targetId null', async () => {
    const { service, applyImportUpsertBatch } = makeServices({});
    const buffer = buildBuffer([
      { id: '', substanceName: 'Tolueno', cas: '108-88-3', status: 'DRAFT' },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });

    expect(result.applied.created).toBe(1);
    expect(applyImportUpsertBatch).toHaveBeenCalledTimes(1);
    const items = applyImportUpsertBatch.mock.calls[0][0];
    expect(items).toHaveLength(1);
    expect(items[0].targetId).toBeNull();
    expect(items[0].dedupeKey).toBe('tolueno|108-88-3|||');
  });

  it('plano vazio (tudo UNCHANGED) → nenhuma escrita (idempotência)', async () => {
    const existing = makeRecord({
      id: 'rec-1',
      substanceName: 'Tolueno',
      cas: '108-88-3',
      status: PcmsoAcgihBeiIndicatorStatusEnum.ACTIVE,
    });
    const { service, applyImportUpsertBatch } = makeServices({
      byIds: [existing],
      byDedupe: [existing],
    });
    const buffer = buildBuffer([
      { id: 'rec-1', substanceName: 'Tolueno', cas: '108-88-3', status: 'ACTIVE' },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });

    expect(result.applied.created).toBe(0);
    expect(result.applied.updated).toBe(0);
    expect(result.applied.unchanged).toBe(1);
    expect(applyImportUpsertBatch).not.toHaveBeenCalled();
  });

  it('aplica UPDATE via âncora id', async () => {
    const existing = makeRecord({
      id: 'rec-1',
      substanceName: 'Tolueno',
      cas: '108-88-3',
      status: PcmsoAcgihBeiIndicatorStatusEnum.DRAFT,
    });
    const { service, applyImportUpsertBatch } = makeServices({
      byIds: [existing],
      byDedupe: [existing],
    });
    const buffer = buildBuffer([
      { id: 'rec-1', substanceName: 'Tolueno', cas: '108-88-3', status: 'ACTIVE' },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });

    expect(result.applied.updated).toBe(1);
    const items = applyImportUpsertBatch.mock.calls[0][0];
    expect(items[0].targetId).toBe('rec-1');
    expect(items[0].payload.status).toBe('ACTIVE');
  });
});
