import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';

import { mapHoMethodRecord } from './ho-method.mapper';
import {
  HoMethodBrowseFilters,
  HoMethodRecord,
  hoMethodInclude,
  hoMethodLegacyInclude,
} from './ho-method.types';

@Injectable()
export class HoMethodDAO {
  private readonly logger = new Logger(HoMethodDAO.name);

  constructor(
    private readonly prisma: PrismaServiceV2,
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
  ) {}

  async browse(params: {
    page?: number;
    limit?: number;
    filters?: HoMethodBrowseFilters;
  }) {
    const pagination = getPagination(params.page, params.limit);
    const where = this.buildWhere(params.filters);

    const { results, includeMode } = await this.findManyWithFallback({
      where,
      orderBy: [{ prioritized: 'desc' }, { displayName: 'asc' }],
      skip: pagination.offSet,
      take: pagination.limit,
    });

    const total = await this.prisma.hoMethod.count({ where });

    const mapped = results
      .map((record) => this.safeMapRecord(record))
      .filter((record): record is HoMethodRecord => Boolean(record));

    return {
      results: await this.enrichRecords(mapped),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  async findById(id: string) {
    const record = await this.findFirstWithFallback({
      where: { id, deleted_at: null },
    });

    if (!record) return null;

    const mapped = this.safeMapRecord(record);
    if (!mapped) return null;

    const [enriched] = await this.enrichRecords([mapped]);
    return enriched;
  }

  async findDocumentFile(methodId: string) {
    const method = await this.prisma.hoMethod.findFirst({
      where: { id: methodId, deleted_at: null },
      select: { originalDocumentFileId: true, originalDocumentName: true },
    });

    if (!method?.originalDocumentFileId) return null;

    const file = await this.prisma.systemFile.findFirst({
      where: {
        id: method.originalDocumentFileId,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        key: true,
        bucket: true,
        url: true,
      },
    });

    if (!file) return null;

    return {
      ...file,
      fallbackName: method.originalDocumentName ?? file.name,
    };
  }

  async existsDuplicate(params: {
    institution: string;
    methodCode: string;
    methodVersion?: string | null;
    excludeId?: string;
  }) {
    const record = await this.prisma.hoMethod.findFirst({
      where: {
        institution: params.institution as any,
        methodCode: params.methodCode,
        methodVersion: params.methodVersion ?? null,
        deleted_at: null,
        ...(params.excludeId ? { NOT: { id: params.excludeId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(record);
  }

  private async findManyWithFallback(params: {
    where: Prisma.HoMethodWhereInput;
    orderBy: Prisma.HoMethodOrderByWithRelationInput[];
    skip: number;
    take: number;
  }) {
    try {
      const results = await this.prisma.hoMethod.findMany({
        ...params,
        include: hoMethodInclude,
      });
      return { results, includeMode: 'full' as const };
    } catch (error) {
      if (!this.shouldFallbackToLegacyInclude(error)) throw error;

      this.logger.warn(
        'Prisma client desatualizado ou relação agents indisponível. Usando include legado no browse.',
      );

      const results = await this.prisma.hoMethod.findMany({
        ...params,
        include: hoMethodLegacyInclude,
      });

      return { results, includeMode: 'legacy' as const };
    }
  }

  private async findFirstWithFallback(params: {
    where: Prisma.HoMethodWhereInput;
  }) {
    try {
      return await this.prisma.hoMethod.findFirst({
        ...params,
        include: hoMethodInclude,
      });
    } catch (error) {
      if (!this.shouldFallbackToLegacyInclude(error)) throw error;

      this.logger.warn(
        'Prisma client desatualizado ou relação agents indisponível. Usando include legado no read.',
      );

      return this.prisma.hoMethod.findFirst({
        ...params,
        include: hoMethodLegacyInclude,
      });
    }
  }

  private shouldFallbackToLegacyInclude(error: unknown) {
    if (!(error instanceof Prisma.PrismaClientValidationError)) return false;

    const message = error.message ?? '';
    return (
      message.includes('Unknown field `agents`') ||
      message.includes('Invalid scalar field `sampler`')
    );
  }

  private safeMapRecord(record: unknown): HoMethodRecord | null {
    try {
      return mapHoMethodRecord(record as any);
    } catch (error) {
      this.logger.error(
        `Falha ao mapear método ${(record as { id?: string })?.id ?? 'desconhecido'}`,
        error instanceof Error ? error.stack : String(error),
      );
      return null;
    }
  }

  private async enrichRecords(
    records: HoMethodRecord[],
  ): Promise<HoMethodRecord[]> {
    if (!records.length) return records;

    const fileIds = records
      .map((record) => record.originalDocumentFileId)
      .filter((fileId): fileId is string => Boolean(fileId));

    const urlById = new Map<string, string>();

    if (fileIds.length) {
      try {
        const files = await this.prisma.systemFile.findMany({
          where: {
            id: { in: fileIds },
            deleted_at: null,
          },
          select: {
            id: true,
            url: true,
            key: true,
            bucket: true,
          },
        });

        await Promise.all(
          files.map(async (file) => {
            try {
              const signedUrl = await this.storage.generateSignedPath({
                fileKey: file.key,
                bucket: file.bucket,
                expires: 3600,
              });
              if (signedUrl?.trim()) {
                urlById.set(file.id, signedUrl);
              }
            } catch (error) {
              this.logger.warn(
                `[HoMethodDAO] Falha ao gerar URL assinada para arquivo ${file.id}: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              );
            }

            if (!urlById.has(file.id) && file.url?.trim()) {
              urlById.set(file.id, file.url);
            }
          }),
        );
      } catch (error) {
        this.logger.warn(
          `[HoMethodDAO] Falha ao enriquecer arquivos PDF: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return records.map((record) => {
      const downloadPath = record.originalDocumentFileId
        ? this.buildDocumentDownloadPath(record.id)
        : null;
      const signedOrDirectUrl = record.originalDocumentFileId
        ? urlById.get(record.originalDocumentFileId) ?? null
        : null;

      return {
        ...record,
        originalDocumentUrl: signedOrDirectUrl,
        originalDocumentDownloadPath: downloadPath,
      };
    });
  }

  buildDocumentDownloadPath(methodId: string) {
    return `v2/ho-methods/${methodId}/original-document`;
  }

  private buildWhere(filters?: HoMethodBrowseFilters): Prisma.HoMethodWhereInput {
    const where: Prisma.HoMethodWhereInput = {
      deleted_at: null,
    };

    if (filters?.agentName?.trim()) {
      where.agentName = { contains: filters.agentName.trim(), mode: 'insensitive' };
    }

    if (filters?.cas?.trim()) {
      where.cas = { contains: filters.cas.trim(), mode: 'insensitive' };
    }

    if (filters?.institution) {
      where.institution = filters.institution;
    }

    if (filters?.methodCode?.trim()) {
      where.methodCode = { contains: filters.methodCode.trim(), mode: 'insensitive' };
    }

    if (filters?.analyticalMethod?.trim()) {
      where.analyticalMethod = {
        contains: filters.analyticalMethod.trim(),
        mode: 'insensitive',
      };
    }

    if (filters?.evaluationType) {
      where.evaluationConditions = {
        some: { evaluationType: filters.evaluationType },
      };
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (typeof filters?.prioritized === 'boolean') {
      where.prioritized = filters.prioritized;
    }

    if (filters?.search?.trim()) {
      const search = filters.search.trim();
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { agentName: { contains: search, mode: 'insensitive' } },
        { cas: { contains: search, mode: 'insensitive' } },
        { methodCode: { contains: search, mode: 'insensitive' } },
        { analyticalMethod: { contains: search, mode: 'insensitive' } },
        { sampler: { name: { contains: search, mode: 'insensitive' } } },
        {
          laboratories: {
            some: {
              OR: [
                {
                  laboratoryName: { contains: search, mode: 'insensitive' },
                },
                {
                  laboratory: {
                    corporateName: { contains: search, mode: 'insensitive' },
                  },
                },
                {
                  laboratory: {
                    tradeName: { contains: search, mode: 'insensitive' },
                  },
                },
              ],
              deleted_at: null,
            },
          },
        },
      ];
    }

    return where;
  }
}
