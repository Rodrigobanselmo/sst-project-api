import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma, DocumentTypeEnum } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocumentDto } from '../../dto/risk-document.dto';
import { RiskDocumentEntity } from '../../entities/riskDocument.entity';
import { FindDocVersionDto } from '../../dto/doc-version.dto';

@Injectable()
export class RiskDocumentRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({ companyId, attachments, ...createDto }: UpsertRiskDocumentDto): Promise<RiskDocumentEntity> {
    const riskFactorDocEntity = await this.prisma.riskFactorDocument.upsert({
      create: {
        ...createDto,
        attachments: attachments
          ? {
              create: attachments.map((attachment) => ({
                ...attachment,
              })),
            }
          : undefined,
        companyId,
      },
      update: {
        ...createDto,
        attachments: attachments
          ? {
              create: attachments.map((attachment) => ({
                ...attachment,
              })),
            }
          : undefined,
        companyId,
      },
      where: { id_companyId: { companyId, id: createDto.id || 'not-found' } },
    });

    return new RiskDocumentEntity(riskFactorDocEntity);
  }

  async findByRiskGroupAndCompany(documentDataId: string, companyId: string) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findMany({
      where: { companyId, documentDataId },
    });

    return riskDocumentEntity.map((data) => new RiskDocumentEntity(data));
  }

  async findDocumentData(documentDataId: string, companyId: string, type: DocumentTypeEnum) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findMany({
      where: { companyId, documentDataId, version: { endsWith: '.0.0' }, documentData: { type } },
    });

    return riskDocumentEntity.map((data) => new RiskDocumentEntity(data));
  }

  async find(query: Partial<FindDocVersionDto & { companyId: string }>, pagination: PaginationQueryDto, options: Prisma.RiskFactorDocumentFindManyArgs = {}) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'type'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }, { version: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
    }

    if ('type' in query) {
      (where.AND as any).push({
        documentData: { type: query.type },
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.riskFactorDocument.count({
        where,
      }),
      this.prisma.riskFactorDocument.findMany({
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { created_at: 'desc' },
        ...options,
      }),
    ]);

    return {
      data: response[1].map((doc) => new RiskDocumentEntity(doc)),
      count: response[0],
    };
  }

  async findById(
    id: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorDocumentSelect;
      include?: Prisma.RiskFactorDocumentInclude;
    } = {},
  ) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findUnique({
      where: { id_companyId: { id, companyId } },
      ...options,
    });

    return new RiskDocumentEntity(riskDocumentEntity);
  }
}
