import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  PcmsoEsocialProcedureSourceEnum,
  PcmsoEsocialProcedureStatusEnum,
  PcmsoEsocialProcedureTypeEnum,
} from '@prisma/client';
import * as XLSX from 'xlsx';

import { EsocialProcedureImportClassification as C } from './esocial-procedure-import.util';
import { EsocialProcedureImportPreviewService } from './esocial-procedure-import-preview.service';

const CATALOG = [
  { code: '0001', name: 'Audiometria tonal' },
  { code: '0002', name: 'Espirometria' },
  { code: '0003', name: 'Hemograma completo' },
  { code: '0004', name: 'Procedimento 0004' },
  { code: '0005', name: 'Procedimento 0005' },
  { code: '0006', name: 'Procedimento 0006' },
];

type Row = Record<string, unknown>;

const buildBuffer = (rows: Row[], sheetName = 'Procedimentos'): Buffer => {
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
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};

const buildCuration = (overrides: Record<string, unknown> = {}) => ({
  id: 'cur-1',
  procedureCode: '0001',
  procedureNameSnapshot: 'Audiometria tonal',
  status: PcmsoEsocialProcedureStatusEnum.DRAFT,
  isOccupationalRelevant: false,
  technicalType: null,
  internalNotes: null,
  source: PcmsoEsocialProcedureSourceEnum.ESOCIAL_TABLE_27,
  createdById: 1,
  updatedById: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  ...overrides,
});

describe('EsocialProcedureImportPreviewService', () => {
  let service: EsocialProcedureImportPreviewService;
  let repository: {
    getOfficialCatalog: jest.Mock;
    findManyCurations: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      getOfficialCatalog: jest.fn(() => Promise.resolve(CATALOG)),
      findManyCurations: jest.fn(() => Promise.resolve([])),
    };
    service = new EsocialProcedureImportPreviewService(repository as never);
  });

  it('classifica CREATE quando código oficial sem curadoria e com campos preenchidos', async () => {
    const buffer = buildBuffer([
      {
        procedureCode: '0001',
        isOccupationalRelevant: 'true',
        technicalType: 'TOXICOLOGICAL',
        status: 'ACTIVE',
        internalNotes: 'obs',
      },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.create).toBe(1);
    expect(result.lines[0].classification).toBe(C.CREATE);
    expect(result.lines[0].procedureNameSnapshot).toBe('Audiometria tonal');
    expect(result.lines[0].fieldChanges).toHaveLength(4);
    expect(
      result.lines[0].fieldChanges.find((c) => c.field === 'isOccupationalRelevant')
        ?.to,
    ).toBe('true');
    expect(
      result.lines[0].fieldChanges.find((c) => c.field === 'technicalType')?.to,
    ).toBe('TOXICOLOGICAL');
  });

  it('classifica UNCHANGED quando sem curadoria no banco e planilha vazia', async () => {
    const buffer = buildBuffer([
      { procedureCode: '0001' },
      { procedureCode: '0002', isOccupationalRelevant: '', technicalType: '', status: '', internalNotes: '' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.unchanged).toBe(2);
    expect(result.totals.create).toBe(0);
    expect(result.lines.every((l) => l.classification === C.UNCHANGED)).toBe(true);
  });

  it('cenário de homologação: 3 linhas preenchidas e demais vazias', async () => {
    const rows: Row[] = [
      {
        procedureCode: '0001',
        isOccupationalRelevant: 'true',
        technicalType: 'TOXICOLOGICAL',
        status: 'ACTIVE',
        internalNotes: 'linha 1',
      },
      {
        procedureCode: '0002',
        isOccupationalRelevant: 'true',
        technicalType: 'TOXICOLOGICAL',
        status: 'ACTIVE',
        internalNotes: 'linha 2',
      },
      {
        procedureCode: '0003',
        isOccupationalRelevant: 'true',
        technicalType: 'TOXICOLOGICAL',
        status: 'ACTIVE',
        internalNotes: 'linha 3',
      },
      { procedureCode: '0004' },
      { procedureCode: '0005' },
      { procedureCode: '0006' },
    ];
    const buffer = buildBuffer(rows);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.read).toBe(6);
    expect(result.totals.create).toBe(3);
    expect(result.totals.unchanged).toBe(3);
    expect(result.totals.update).toBe(0);
    expect(result.totals.rejected).toBe(0);
    expect(result.totals.conflict).toBe(0);
    expect(result.totals.invalid).toBe(0);
    expect(result.totals.valid).toBe(6);
  });

  it('classifica UPDATE quando curadoria existente e planilha limpa campos', async () => {
    repository.findManyCurations.mockResolvedValueOnce([
      buildCuration({
        isOccupationalRelevant: true,
        technicalType: PcmsoEsocialProcedureTypeEnum.TOXICOLOGICAL,
        status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
        internalNotes: 'antes',
      }),
    ] as never);

    const buffer = buildBuffer([{ procedureCode: '0001' }]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.update).toBe(1);
    expect(result.lines[0].classification).toBe(C.UPDATE);
    expect(result.lines[0].fieldChanges.length).toBeGreaterThan(0);
  });

  it('classifica UNCHANGED quando curadoria existente já está nos defaults e planilha vazia', async () => {
    repository.findManyCurations.mockResolvedValueOnce([buildCuration()] as never);

    const buffer = buildBuffer([{ procedureCode: '0001' }]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.unchanged).toBe(1);
    expect(result.totals.update).toBe(0);
  });

  it('classifica UPDATE/UNCHANGED comparando com curadoria existente', async () => {
    repository.findManyCurations.mockResolvedValueOnce([
      buildCuration({ procedureCode: '0001', isOccupationalRelevant: false }),
      buildCuration({ id: 'cur-2', procedureCode: '0002', isOccupationalRelevant: true, status: PcmsoEsocialProcedureStatusEnum.ACTIVE }),
    ] as never);

    const buffer = buildBuffer([
      // muda relevância -> UPDATE
      { procedureCode: '0001', isOccupationalRelevant: 'true', status: 'DRAFT' },
      // igual ao existente -> UNCHANGED
      { procedureCode: '0002', isOccupationalRelevant: 'sim', status: 'ACTIVE' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.update).toBe(1);
    expect(result.totals.unchanged).toBe(1);
    const update = result.lines.find((l) => l.procedureCode === '0001');
    expect(update?.classification).toBe(C.UPDATE);
    expect(update?.changedFields).toContain('isOccupationalRelevant');
  });

  it('REJECTED quando código não existe na Tabela 27 oficial', async () => {
    const buffer = buildBuffer([
      { procedureCode: '9999', isOccupationalRelevant: 'sim', status: 'ACTIVE' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.rejected).toBe(1);
    expect(result.lines[0].classification).toBe(C.REJECTED);
  });

  it('INVALID quando enum/boolean inválido', async () => {
    const buffer = buildBuffer([
      { procedureCode: '0001', isOccupationalRelevant: 'talvez', technicalType: 'RAIOX', status: 'LIGADO' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.invalid).toBe(1);
    expect(result.lines[0].classification).toBe(C.INVALID);
    expect(result.lines[0].errors.length).toBeGreaterThan(0);
  });

  it('CONFLICT quando procedureCode duplicado na planilha', async () => {
    const buffer = buildBuffer([
      { procedureCode: '0001', isOccupationalRelevant: 'sim', status: 'ACTIVE' },
      { procedureCode: '0001', isOccupationalRelevant: 'nao', status: 'DRAFT' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.conflict).toBe(2);
    expect(result.lines.every((l) => l.classification === C.CONFLICT)).toBe(true);
  });

  it('lança erro se a aba "Procedimentos" não existir', async () => {
    const buffer = buildBuffer(
      [{ procedureCode: '0001' }],
      'OutraAba',
    );
    await expect(
      service.preview({ buffer, fileName: 'f.xlsx' }),
    ).rejects.toThrow();
  });

  it('totais consistentes (valid = create+update+unchanged)', async () => {
    repository.findManyCurations.mockResolvedValueOnce([
      buildCuration({ procedureCode: '0002', isOccupationalRelevant: true, status: PcmsoEsocialProcedureStatusEnum.ACTIVE }),
    ] as never);
    const buffer = buildBuffer([
      { procedureCode: '0001', isOccupationalRelevant: 'sim', status: 'ACTIVE' }, // CREATE
      { procedureCode: '0002', isOccupationalRelevant: 'sim', status: 'ACTIVE' }, // UNCHANGED
      { procedureCode: '0003', isOccupationalRelevant: 'true', status: 'DRAFT' }, // CREATE
      { procedureCode: '9999', isOccupationalRelevant: 'sim', status: 'ACTIVE' }, // REJECTED
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.read).toBe(4);
    expect(result.totals.valid).toBe(
      result.totals.create + result.totals.update + result.totals.unchanged,
    );
    expect(result.totals.rejected).toBe(1);
  });
});
