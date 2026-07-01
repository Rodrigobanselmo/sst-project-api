import { Injectable } from '@nestjs/common';
import { Prisma, RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export type BrowseMasterRiskSubTypesFilters = {
  type?: RiskTypeEnum;
  search?: string;
  status?: StatusEnum;
};

export type BrowseMasterRiskSubTypesParams = {
  page: number;
  limit: number;
  filters?: BrowseMasterRiskSubTypesFilters;
};

const selectFields = {
  id: true,
  name: true,
  slug: true,
  type: true,
  description: true,
  status: true,
  system: true,
} satisfies Prisma.RiskSubTypeSelect;

@Injectable()
export class RiskSubTypeMasterRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ page, limit, filters = {} }: BrowseMasterRiskSubTypesParams) {
    const where = this.buildWhere(filters);
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.prisma.riskSubType.findMany({
        where,
        select: selectFields,
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.riskSubType.count({ where }),
    ]);

    return {
      results,
      pagination: { page, limit, total },
    };
  }

  findById(id: number) {
    return this.prisma.riskSubType.findUnique({
      where: { id },
      select: {
        ...selectFields,
        sub_type: true,
        createdById: true,
      },
    });
  }

  findByTypeAndSlug(type: RiskFactorsEnum, slug: string) {
    return this.prisma.riskSubType.findFirst({
      where: { type, slug },
      select: { id: true },
    });
  }

  create(data: Prisma.RiskSubTypeCreateInput) {
    return this.prisma.riskSubType.create({
      data,
      select: selectFields,
    });
  }

  update(id: number, data: Prisma.RiskSubTypeUpdateInput) {
    return this.prisma.riskSubType.update({
      where: { id },
      data,
      select: selectFields,
    });
  }

  private buildWhere(
    filters: BrowseMasterRiskSubTypesFilters,
  ): Prisma.RiskSubTypeWhereInput {
    const where: Prisma.RiskSubTypeWhereInput = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search?.trim()) {
      const search = filters.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
