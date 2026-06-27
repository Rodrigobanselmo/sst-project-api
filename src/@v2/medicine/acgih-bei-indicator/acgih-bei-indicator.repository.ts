import { Injectable } from '@nestjs/common';
import {
  PcmsoAcgihBeiIndicatorConfidenceEnum,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { AcgihBeiPayload } from './acgih-bei-indicator-import.util';

export type AcgihBeiImportUpsertItem = {
  /** Id de registro existente a atualizar (resolvido no momento do apply). */
  targetId: string | null;
  dedupeKey: string;
  substanceNameNormalized: string;
  payload: AcgihBeiPayload;
  userId?: number;
};

@Injectable()
export class AcgihBeiIndicatorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async browse(params: {
    page: number;
    limit: number;
    filters?: {
      search?: string;
      biologicalMatrix?: string;
      status?: PcmsoAcgihBeiIndicatorStatusEnum;
      confidence?: PcmsoAcgihBeiIndicatorConfidenceEnum;
      source?: PcmsoAcgihBeiIndicatorSourceEnum;
      onlyCurated?: boolean;
    };
  }) {
    const filters = params.filters ?? {};
    const where: Prisma.PcmsoAcgihBeiIndicatorWhereInput = { deleted_at: null };

    if (filters.search?.trim()) {
      const search = filters.search.trim();
      where.OR = [
        { substanceName: { contains: search, mode: 'insensitive' } },
        { cas: { contains: search, mode: 'insensitive' } },
        { determinant: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (filters.biologicalMatrix?.trim()) {
      where.biologicalMatrix = {
        contains: filters.biologicalMatrix.trim(),
        mode: 'insensitive',
      };
    }
    if (filters.status) where.status = filters.status;
    if (filters.confidence) where.confidence = filters.confidence;
    if (filters.source) where.source = filters.source;
    if (filters.onlyCurated) where.isCurated = true;

    const [count, data] = await this.prisma.$transaction([
      this.prisma.pcmsoAcgihBeiIndicator.count({ where }),
      this.prisma.pcmsoAcgihBeiIndicator.findMany({
        where,
        orderBy: [{ substanceName: 'asc' }, { determinant: 'asc' }],
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);

    return { count, data, page: params.page, limit: params.limit };
  }

  /** Todos os indicadores ativos (não soft-deleted), ordenados para export. */
  findAllForExport() {
    return this.prisma.pcmsoAcgihBeiIndicator.findMany({
      where: { deleted_at: null },
      orderBy: [{ substanceName: 'asc' }, { determinant: 'asc' }],
    });
  }

  findById(id: string) {
    return this.prisma.pcmsoAcgihBeiIndicator.findFirst({
      where: { id, deleted_at: null },
    });
  }

  /** Inclui soft-deleted — usado no apply para restaurar via âncora id. */
  findByIdsRaw(ids: string[]) {
    if (!ids.length) return Promise.resolve([]);
    return this.prisma.pcmsoAcgihBeiIndicator.findMany({
      where: { id: { in: ids } },
    });
  }

  /** Inclui soft-deleted — usado no apply/preview para upsert por dedupeKey. */
  findByDedupeKeys(dedupeKeys: string[]) {
    if (!dedupeKeys.length) return Promise.resolve([]);
    return this.prisma.pcmsoAcgihBeiIndicator.findMany({
      where: { dedupeKey: { in: dedupeKeys } },
    });
  }

  create(data: Prisma.PcmsoAcgihBeiIndicatorCreateInput) {
    return this.prisma.pcmsoAcgihBeiIndicator.create({ data });
  }

  update(id: string, data: Prisma.PcmsoAcgihBeiIndicatorUpdateInput) {
    return this.prisma.pcmsoAcgihBeiIndicator.update({ where: { id }, data });
  }

  updateStatus(id: string, status: PcmsoAcgihBeiIndicatorStatusEnum) {
    return this.prisma.pcmsoAcgihBeiIndicator.update({
      where: { id },
      data: { status },
    });
  }

  softDelete(id: string) {
    return this.prisma.pcmsoAcgihBeiIndicator.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Aplica o lote em transação atômica e idempotente.
   * - com targetId: update por id (restaura soft-deleted);
   * - sem targetId: upsert por dedupeKey (único).
   * Nunca falha por conflito de dedupeKey e não toca outras tabelas.
   */
  applyImportUpsertBatch(items: AcgihBeiImportUpsertItem[]) {
    if (!items.length) return Promise.resolve();

    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        const writeData = {
          substanceName: item.payload.substanceName,
          substanceNameNormalized: item.substanceNameNormalized,
          cas: item.payload.cas,
          referenceYear: item.payload.referenceYear,
          determinant: item.payload.determinant,
          biologicalMatrix: item.payload.biologicalMatrix,
          samplingTime: item.payload.samplingTime,
          beiValue: item.payload.beiValue,
          unit: item.payload.unit,
          notation: item.payload.notation,
          status: item.payload.status,
          source: item.payload.source,
          sourceYear: item.payload.sourceYear,
          isCurated: item.payload.isCurated,
          internalNotes: item.payload.internalNotes,
          sourcePage: item.payload.sourcePage,
          confidence: item.payload.confidence,
        };

        if (item.targetId) {
          await tx.pcmsoAcgihBeiIndicator.update({
            where: { id: item.targetId },
            data: {
              ...writeData,
              dedupeKey: item.dedupeKey,
              deleted_at: null,
              updatedById: item.userId ?? null,
            },
          });
        } else {
          await tx.pcmsoAcgihBeiIndicator.upsert({
            where: { dedupeKey: item.dedupeKey },
            create: {
              ...writeData,
              dedupeKey: item.dedupeKey,
              createdById: item.userId ?? null,
              updatedById: item.userId ?? null,
            },
            update: {
              ...writeData,
              deleted_at: null,
              updatedById: item.userId ?? null,
            },
          });
        }
      }
    });
  }
}
