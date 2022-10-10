import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocumentDto } from '../../dto/risk-document.dto';
import { RiskDocumentEntity } from '../../entities/riskDocument.entity';
import { FindDocPgrDto } from '../../dto/doc-pgr.dto';

@Injectable()
export class RiskDocumentRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({
    companyId,
    attachments,
    ...createDto
  }: UpsertRiskDocumentDto): Promise<RiskDocumentEntity> {
    const riskFactorDocEntity = await this.prisma.riskFactorDocument.upsert({
      create: {
        companyId,
        attachments: attachments
          ? {
              create: attachments.map((attachment) => ({
                ...attachment,
              })),
            }
          : undefined,
        ...createDto,
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

  async findByRiskGroupAndCompany(riskGroupId: string, companyId: string) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findMany({
      where: { companyId, riskGroupId },
    });

    return riskDocumentEntity.map((data) => new RiskDocumentEntity(data));
  }

  async find(
    query: Partial<FindDocPgrDto & { companyId: string; riskGroupId: string }>,
    pagination: PaginationQueryDto,
    options: Prisma.RiskFactorDocumentFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
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
