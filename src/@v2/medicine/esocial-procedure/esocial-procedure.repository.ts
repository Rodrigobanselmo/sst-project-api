import { Injectable } from '@nestjs/common';
import {
  PcmsoEsocialProcedureSourceEnum,
  PcmsoEsocialProcedureStatusEnum,
  Prisma,
} from '@prisma/client';

import { FindAllTable27Service } from '@/modules/esocial/services/tables/find-all-27.service';
import { PrismaService } from '@/prisma/prisma.service';

import { EsocialProcedureCurationPayload } from './esocial-procedure-import.util';

export type EsocialTable27CatalogItem = { code: string; name: string };

export type EsocialProcedureImportUpsertItem = {
  procedureCode: string;
  procedureNameSnapshot: string | null;
  payload: EsocialProcedureCurationPayload;
  userId?: number;
};

@Injectable()
export class EsocialProcedureRepository {
  constructor(
    private readonly prisma: PrismaService,
    // Leitura apenas: catálogo oficial da Tabela 27. NUNCA é escrito por este módulo.
    private readonly findAllTable27Service: FindAllTable27Service,
  ) {}

  /** Catálogo oficial da Tabela 27 (somente leitura). */
  async getOfficialCatalog(): Promise<EsocialTable27CatalogItem[]> {
    return this.findAllTable27Service.execute();
  }

  findManyCurations(procedureCodes?: string[]) {
    return this.prisma.pcmsoEsocialProcedure.findMany({
      where: {
        deleted_at: null,
        ...(procedureCodes ? { procedureCode: { in: procedureCodes } } : {}),
      },
    });
  }

  /** Inclui soft-deleted — usado no apply para upsert idempotente por procedureCode. */
  findByProcedureCodes(procedureCodes: string[]) {
    if (!procedureCodes.length) return Promise.resolve([]);
    return this.prisma.pcmsoEsocialProcedure.findMany({
      where: { procedureCode: { in: procedureCodes } },
    });
  }

  findCurationByCode(procedureCode: string) {
    return this.prisma.pcmsoEsocialProcedure.findFirst({
      where: { procedureCode, deleted_at: null },
    });
  }

  findCurationById(id: string) {
    return this.prisma.pcmsoEsocialProcedure.findFirst({
      where: { id, deleted_at: null },
    });
  }

  create(data: Prisma.PcmsoEsocialProcedureCreateInput) {
    return this.prisma.pcmsoEsocialProcedure.create({ data });
  }

  update(id: string, data: Prisma.PcmsoEsocialProcedureUpdateInput) {
    return this.prisma.pcmsoEsocialProcedure.update({ where: { id }, data });
  }

  updateStatus(id: string, status: PcmsoEsocialProcedureStatusEnum) {
    return this.prisma.pcmsoEsocialProcedure.update({
      where: { id },
      data: { status },
    });
  }

  softDelete(id: string) {
    return this.prisma.pcmsoEsocialProcedure.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Upsert idempotente por procedureCode em transação atômica.
   * Restaura soft-deleted (deleted_at=null). Nunca altera a Tabela 27 oficial.
   */
  applyImportUpsertBatch(items: EsocialProcedureImportUpsertItem[]) {
    if (!items.length) return Promise.resolve();

    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.pcmsoEsocialProcedure.upsert({
          where: { procedureCode: item.procedureCode },
          create: {
            procedureCode: item.procedureCode,
            procedureNameSnapshot: item.procedureNameSnapshot,
            isOccupationalRelevant: item.payload.isOccupationalRelevant,
            technicalType: item.payload.technicalType,
            status: item.payload.status,
            internalNotes: item.payload.internalNotes,
            source: PcmsoEsocialProcedureSourceEnum.ESOCIAL_TABLE_27,
            createdById: item.userId ?? null,
            updatedById: item.userId ?? null,
          },
          update: {
            procedureNameSnapshot: item.procedureNameSnapshot,
            isOccupationalRelevant: item.payload.isOccupationalRelevant,
            technicalType: item.payload.technicalType,
            status: item.payload.status,
            internalNotes: item.payload.internalNotes,
            deleted_at: null,
            updatedById: item.userId ?? null,
          },
        });
      }
    });
  }
}
