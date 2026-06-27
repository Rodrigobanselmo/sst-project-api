import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  PcmsoEsocialProcedureStatusEnum,
} from '@prisma/client';
import * as XLSX from 'xlsx';

import { EsocialProcedureImportApplyService } from './esocial-procedure-import-apply.service';
import { EsocialProcedureImportPreviewService } from './esocial-procedure-import-preview.service';

const CATALOG = [
  { code: '0001', name: 'Audiometria tonal' },
  { code: '0002', name: 'Espirometria' },
  { code: '0003', name: 'Hemograma completo' },
];

const buildBuffer = (rows: Record<string, unknown>[]): Buffer => {
  const ws = XLSX.utils.json_to_sheet(rows, {
    header: [
      'procedureCode',
      'procedureNameSnapshot',
      'isOccupationalRelevant',
      'technicalType',
      'status',
      'internalNotes',
    ],
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Procedimentos');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};

describe('EsocialProcedureImportApplyService', () => {
  let service: EsocialProcedureImportApplyService;
  let repository: {
    getOfficialCatalog: jest.Mock;
    findManyCurations: jest.Mock;
    findByProcedureCodes: jest.Mock;
    applyImportUpsertBatch: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      getOfficialCatalog: jest.fn(() => Promise.resolve(CATALOG)),
      findManyCurations: jest.fn(() => Promise.resolve([])),
      findByProcedureCodes: jest.fn(() => Promise.resolve([])),
      applyImportUpsertBatch: jest.fn(() => Promise.resolve(undefined)),
    };
    const preview = new EsocialProcedureImportPreviewService(repository as never);
    service = new EsocialProcedureImportApplyService(
      repository as never,
      preview,
    );
  });

  it('aplica upsert com userId para linhas CREATE', async () => {
    const buffer = buildBuffer([
      { procedureCode: '0001', isOccupationalRelevant: 'sim', technicalType: 'AUDIOMETRY', status: 'ACTIVE' },
      { procedureCode: '0002', isOccupationalRelevant: 'nao', status: 'DRAFT' },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx', userId: 7 });

    expect(result.applied.created).toBe(2);
    expect(result.applied.updated).toBe(0);
    expect(result.affectedCodes.sort()).toEqual(['0001', '0002']);

    const batchArg = repository.applyImportUpsertBatch.mock.calls[0][0] as Array<{
      procedureCode: string;
      userId: number;
      payload: { status: string };
    }>;
    expect(batchArg).toHaveLength(2);
    expect(batchArg[0].userId).toBe(7);
    expect(batchArg[0].procedureCode).toBe('0001');
  });

  it('aplica updates apenas em linhas alteradas (idempotência)', async () => {
    const existing = [
      {
        id: 'cur-1',
        procedureCode: '0001',
        procedureNameSnapshot: 'Audiometria tonal',
        status: PcmsoEsocialProcedureStatusEnum.DRAFT,
        isOccupationalRelevant: false,
        technicalType: null,
        internalNotes: null,
        deleted_at: null,
      },
      {
        id: 'cur-2',
        procedureCode: '0002',
        procedureNameSnapshot: 'Espirometria',
        status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
        isOccupationalRelevant: true,
        technicalType: null,
        internalNotes: null,
        deleted_at: null,
      },
    ];
    repository.findManyCurations.mockResolvedValue(existing as never);
    repository.findByProcedureCodes.mockImplementation((codes: string[]) =>
      Promise.resolve(existing.filter((row) => codes.includes(row.procedureCode))),
    );

    const buffer = buildBuffer([
      { procedureCode: '0001', isOccupationalRelevant: 'true', status: 'DRAFT' }, // UPDATE
      { procedureCode: '0002', isOccupationalRelevant: 'sim', status: 'ACTIVE' }, // UNCHANGED
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });

    expect(result.applied.updated).toBe(1);
    expect(result.applied.created).toBe(0);
    expect(result.applied.unchanged).toBe(1);

    const batchArg = repository.applyImportUpsertBatch.mock.calls[0][0] as Array<{
      procedureCode: string;
    }>;
    expect(batchArg).toHaveLength(1);
    expect(batchArg[0].procedureCode).toBe('0001');
  });

  it('não cria registros para linhas sem curadoria preenchida', async () => {
    const buffer = buildBuffer([
      {
        procedureCode: '0001',
        isOccupationalRelevant: 'true',
        technicalType: 'TOXICOLOGICAL',
        status: 'ACTIVE',
        internalNotes: 'obs',
      },
      { procedureCode: '0002' },
      { procedureCode: '0003' },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx', userId: 1 });

    expect(result.applied.created).toBe(1);
    expect(result.applied.unchanged).toBe(2);
    expect(result.affectedCodes).toEqual(['0001']);
    expect(repository.applyImportUpsertBatch).toHaveBeenCalledTimes(1);
  });

  it('não chama o banco quando não há upserts', async () => {
    const buffer = buildBuffer([
      { procedureCode: '9999', isOccupationalRelevant: 'sim', status: 'ACTIVE' }, // REJECTED
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });
    expect(repository.applyImportUpsertBatch).not.toHaveBeenCalled();
    expect(result.applied.rejected).toBe(1);
  });

  it('reaplicar a mesma planilha vira tudo UNCHANGED (idempotente)', async () => {
    const existing = [
      {
        id: 'cur-1',
        procedureCode: '0001',
        procedureNameSnapshot: 'Audiometria tonal',
        status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
        isOccupationalRelevant: true,
        technicalType: null,
        internalNotes: null,
        deleted_at: null,
      },
    ];
    repository.findManyCurations.mockResolvedValue(existing as never);
    repository.findByProcedureCodes.mockResolvedValue(existing as never);

    const buffer = buildBuffer([
      { procedureCode: '0001', isOccupationalRelevant: 'sim', status: 'ACTIVE' },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });
    expect(result.applied.created).toBe(0);
    expect(result.applied.updated).toBe(0);
    expect(result.applied.unchanged).toBe(1);
    expect(repository.applyImportUpsertBatch).not.toHaveBeenCalled();
  });

  it('registro criado entre prévia e apply vira update (sem conflito P2002)', async () => {
    // buildModel (findManyCurations) não vê o registro — classifica CREATE.
    repository.findManyCurations.mockResolvedValue([] as never);
    repository.findByProcedureCodes.mockResolvedValue([
      {
        id: 'cur-new',
        procedureCode: '0001',
        procedureNameSnapshot: 'Audiometria tonal',
        status: PcmsoEsocialProcedureStatusEnum.DRAFT,
        isOccupationalRelevant: false,
        technicalType: null,
        internalNotes: null,
        deleted_at: null,
      },
    ] as never);

    const buffer = buildBuffer([
      {
        procedureCode: '0001',
        isOccupationalRelevant: 'true',
        technicalType: 'TOXICOLOGICAL',
        status: 'ACTIVE',
        internalNotes: 'obs',
      },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });

    expect(result.applied.created).toBe(0);
    expect(result.applied.updated).toBe(1);
    expect(repository.applyImportUpsertBatch).toHaveBeenCalledTimes(1);
  });

  it('apply duplicado da mesma planilha após primeira aplicação é idempotente', async () => {
    const buffer = buildBuffer([
      {
        procedureCode: '0001',
        isOccupationalRelevant: 'true',
        technicalType: 'TOXICOLOGICAL',
        status: 'ACTIVE',
      },
    ]);

    const first = await service.apply({ buffer, fileName: 'f.xlsx' });
    expect(first.applied.created).toBe(1);

    const stored = {
      id: 'cur-1',
      procedureCode: '0001',
      procedureNameSnapshot: 'Audiometria tonal',
      status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
      isOccupationalRelevant: true,
      technicalType: 'TOXICOLOGICAL',
      internalNotes: null,
      deleted_at: null,
    };
    repository.findManyCurations.mockResolvedValue([stored] as never);
    repository.findByProcedureCodes.mockResolvedValue([stored] as never);

    const second = await service.apply({ buffer, fileName: 'f.xlsx' });
    expect(second.applied.created).toBe(0);
    expect(second.applied.updated).toBe(0);
    expect(second.applied.unchanged).toBe(1);
    expect(repository.applyImportUpsertBatch).toHaveBeenCalledTimes(1);
  });

  it('restaura soft-deleted via upsert sem conflito de procedureCode', async () => {
    repository.findManyCurations.mockResolvedValue([] as never);
    repository.findByProcedureCodes.mockResolvedValue([
      {
        id: 'cur-deleted',
        procedureCode: '0001',
        procedureNameSnapshot: 'Audiometria tonal',
        status: PcmsoEsocialProcedureStatusEnum.DEPRECATED,
        isOccupationalRelevant: false,
        technicalType: null,
        internalNotes: null,
        deleted_at: new Date(),
      },
    ] as never);

    const buffer = buildBuffer([
      {
        procedureCode: '0001',
        isOccupationalRelevant: 'true',
        status: 'ACTIVE',
      },
    ]);
    const result = await service.apply({ buffer, fileName: 'f.xlsx' });

    expect(result.applied.created).toBe(0);
    expect(result.applied.updated).toBe(1);
    expect(repository.applyImportUpsertBatch).toHaveBeenCalledTimes(1);
  });
});
