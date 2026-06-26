import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import {
  PcmsoEsocialProcedureSourceEnum,
  PcmsoEsocialProcedureStatusEnum,
  PcmsoEsocialProcedureTypeEnum,
} from '@prisma/client';

import { EsocialProcedureService } from './esocial-procedure.service';

const catalog = [
  { code: '0001', name: 'Audiometria tonal' },
  { code: '0002', name: 'Espirometria' },
  { code: '0003', name: 'Hemograma completo' },
];

const buildCuration = (overrides: Record<string, unknown> = {}) => ({
  id: 'cur-1',
  procedureCode: '0001',
  procedureNameSnapshot: 'Audiometria tonal',
  status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
  isOccupationalRelevant: true,
  technicalType: PcmsoEsocialProcedureTypeEnum.AUDIOMETRY,
  internalNotes: 'uso ocupacional',
  source: PcmsoEsocialProcedureSourceEnum.ESOCIAL_TABLE_27,
  createdById: 1,
  updatedById: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  ...overrides,
});

describe('EsocialProcedureService', () => {
  let service: EsocialProcedureService;
  let repository: {
    getOfficialCatalog: jest.Mock;
    findManyCurations: jest.Mock;
    findCurationByCode: jest.Mock;
    findCurationById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    updateStatus: jest.Mock;
    softDelete: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      getOfficialCatalog: jest.fn(() => Promise.resolve(catalog)),
      findManyCurations: jest.fn(() => Promise.resolve([])),
      findCurationByCode: jest.fn(() => Promise.resolve(null)),
      findCurationById: jest.fn(() => Promise.resolve(null)),
      create: jest.fn((data) => Promise.resolve({ id: 'cur-new', ...(data as object) })),
      update: jest.fn((id, data) => Promise.resolve({ id, ...(data as object) })),
      updateStatus: jest.fn((id, status) => Promise.resolve({ id, status })),
      softDelete: jest.fn((id) => Promise.resolve({ id, deleted_at: new Date() })),
    };

    service = new EsocialProcedureService(repository as never);
  });

  describe('browse (merge catálogo × curadoria)', () => {
    it('retorna todo o catálogo oficial com curation null quando não há curadoria', async () => {
      const result = await service.browse({ page: 1, limit: 20 });

      expect(result.count).toBe(3);
      expect(result.data).toHaveLength(3);
      expect(result.data.every((item) => item.curation === null)).toBe(true);
      expect(result.data[0]).toMatchObject({
        procedureCode: '0001',
        officialName: 'Audiometria tonal',
        isOrphanCuration: false,
      });
    });

    it('anexa a curadoria ao item oficial correspondente', async () => {
      repository.findManyCurations.mockResolvedValueOnce([buildCuration()] as never);

      const result = await service.browse({ page: 1, limit: 20 });
      const item = result.data.find((i) => i.procedureCode === '0001');

      expect(item?.curation).not.toBeNull();
      expect(item?.curation?.status).toBe(PcmsoEsocialProcedureStatusEnum.ACTIVE);
    });

    it('inclui curadorias órfãs (código fora do catálogo oficial)', async () => {
      repository.findManyCurations.mockResolvedValueOnce([
        buildCuration({ id: 'cur-orphan', procedureCode: '9999', procedureNameSnapshot: 'Obsoleto' }),
      ] as never);

      const result = await service.browse({ page: 1, limit: 20 });
      const orphan = result.data.find((i) => i.procedureCode === '9999');

      expect(result.count).toBe(4);
      expect(orphan?.isOrphanCuration).toBe(true);
      expect(orphan?.officialName).toBe('Obsoleto');
    });

    it('filtra por busca em código e nome (case/acentos-insensitive)', async () => {
      const result = await service.browse({
        page: 1,
        limit: 20,
        filters: { search: 'espiro' },
      });

      expect(result.count).toBe(1);
      expect(result.data[0].procedureCode).toBe('0002');
    });

    it('filtra onlyCurated', async () => {
      repository.findManyCurations.mockResolvedValueOnce([buildCuration()] as never);

      const result = await service.browse({
        page: 1,
        limit: 20,
        filters: { onlyCurated: true },
      });

      expect(result.count).toBe(1);
      expect(result.data[0].procedureCode).toBe('0001');
    });

    it('filtra por status, technicalType e isOccupationalRelevant da curadoria', async () => {
      repository.findManyCurations.mockResolvedValue([
        buildCuration(),
        buildCuration({
          id: 'cur-2',
          procedureCode: '0002',
          status: PcmsoEsocialProcedureStatusEnum.DRAFT,
          technicalType: PcmsoEsocialProcedureTypeEnum.SPIROMETRY,
          isOccupationalRelevant: false,
        }),
      ] as never);

      const byStatus = await service.browse({
        page: 1,
        limit: 20,
        filters: { status: PcmsoEsocialProcedureStatusEnum.ACTIVE },
      });
      expect(byStatus.count).toBe(1);
      expect(byStatus.data[0].procedureCode).toBe('0001');

      const byType = await service.browse({
        page: 1,
        limit: 20,
        filters: { technicalType: PcmsoEsocialProcedureTypeEnum.SPIROMETRY },
      });
      expect(byType.count).toBe(1);
      expect(byType.data[0].procedureCode).toBe('0002');

      const byRelevant = await service.browse({
        page: 1,
        limit: 20,
        filters: { isOccupationalRelevant: true },
      });
      expect(byRelevant.count).toBe(1);
      expect(byRelevant.data[0].procedureCode).toBe('0001');
    });

    it('pagina o resultado mantendo count total', async () => {
      const result = await service.browse({ page: 2, limit: 2 });

      expect(result.count).toBe(3);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].procedureCode).toBe('0003');
    });

    it('nunca chama mutações do catálogo oficial (somente leitura)', async () => {
      await service.browse({ page: 1, limit: 20 });
      expect(repository.getOfficialCatalog).toHaveBeenCalledTimes(1);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('getByCode', () => {
    it('retorna item oficial mesmo sem curadoria', async () => {
      const result = await service.getByCode('0002');
      expect(result.officialName).toBe('Espirometria');
      expect(result.curation).toBeNull();
      expect(result.isOrphanCuration).toBe(false);
    });

    it('marca órfão quando só existe curadoria', async () => {
      repository.findCurationByCode.mockResolvedValueOnce(
        buildCuration({ procedureCode: '9999', procedureNameSnapshot: 'Antigo' }) as never,
      );
      const result = await service.getByCode('9999');
      expect(result.isOrphanCuration).toBe(true);
      expect(result.officialName).toBe('Antigo');
    });

    it('lança NotFound quando não existe em lugar nenhum', async () => {
      await expect(service.getByCode('0404')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('upsertByCode (idempotente)', () => {
    it('cria curadoria nova com snapshot do nome oficial', async () => {
      const result: any = await service.upsertByCode(
        '0001',
        { isOccupationalRelevant: true, technicalType: PcmsoEsocialProcedureTypeEnum.AUDIOMETRY },
        42,
      );

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(result.procedureCode).toBe('0001');
      expect(result.procedureNameSnapshot).toBe('Audiometria tonal');
      expect(result.status).toBe(PcmsoEsocialProcedureStatusEnum.DRAFT);
      expect(result.isOccupationalRelevant).toBe(true);
      expect(result.createdById).toBe(42);
    });

    it('atualiza curadoria existente sem criar duplicata', async () => {
      repository.findCurationByCode.mockResolvedValueOnce(buildCuration() as never);

      const result: any = await service.upsertByCode(
        '0001',
        { internalNotes: 'nova obs', status: PcmsoEsocialProcedureStatusEnum.DEPRECATED },
        7,
      );

      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(result.internalNotes).toBe('nova obs');
      expect(result.status).toBe(PcmsoEsocialProcedureStatusEnum.DEPRECATED);
      expect(result.updatedById).toBe(7);
      expect(result.procedureNameSnapshot).toBe('Audiometria tonal');
    });

    it('permite limpar technicalType/internalNotes com null explícito', async () => {
      repository.findCurationByCode.mockResolvedValueOnce(buildCuration() as never);

      const result: any = await service.upsertByCode(
        '0001',
        { technicalType: null, internalNotes: null },
      );

      expect(result.technicalType).toBeNull();
      expect(result.internalNotes).toBeNull();
    });

    it('lança NotFound ao tentar curar código fora da Tabela 27 oficial', async () => {
      await expect(
        service.upsertByCode('9999', { isOccupationalRelevant: true }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus / softDelete', () => {
    it('atualiza status de curadoria existente', async () => {
      repository.findCurationById.mockResolvedValueOnce(buildCuration() as never);

      const result: any = await service.updateStatus(
        'cur-1',
        PcmsoEsocialProcedureStatusEnum.DEPRECATED,
      );

      expect(repository.updateStatus).toHaveBeenCalledWith(
        'cur-1',
        PcmsoEsocialProcedureStatusEnum.DEPRECATED,
      );
      expect(result.status).toBe(PcmsoEsocialProcedureStatusEnum.DEPRECATED);
    });

    it('lança NotFound ao atualizar status inexistente', async () => {
      await expect(
        service.updateStatus('missing', PcmsoEsocialProcedureStatusEnum.ACTIVE),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('faz soft delete de curadoria existente', async () => {
      repository.findCurationById.mockResolvedValueOnce(buildCuration() as never);

      const result: any = await service.softDelete('cur-1');

      expect(repository.softDelete).toHaveBeenCalledWith('cur-1');
      expect(result.deleted_at).not.toBeNull();
    });

    it('lança NotFound ao deletar curadoria inexistente', async () => {
      await expect(service.softDelete('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
