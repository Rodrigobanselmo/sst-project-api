import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GenerateSourceBrowseModelMapper } from '../../mappers/models/generate-source/generate-source-browse.mapper';
import { IGenerateSourceBrowseResultModelMapper } from '../../mappers/models/generate-source/generate-source-browse-result.mapper';
import { GenerateSourceOrderByEnum, IGenerateSourceDAO } from './generate-source.types';

@Injectable()
export class GenerateSourceDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ limit, page, orderBy, filters }: IGenerateSourceDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const browseFilterParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...browseFilterParams];

    const generateSourcesPromise = this.prisma.$queryRaw<IGenerateSourceBrowseResultModelMapper[]>`
      SELECT 
        gs."id" AS generate_source_id,
        gs."name" AS generate_source_name,
        gs."created_at" AS generate_source_created_at,
        gs."updated_at" AS generate_source_updated_at,
        risk."id" AS risk_id,
        risk."name" AS risk_name,
        risk."type" AS risk_type
      FROM 
        "GenerateSource" gs
      LEFT JOIN
        "RiskFactors" risk ON risk."id" = gs."riskId"
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalGenerateSourcesPromise = this.prisma.$queryRaw<[{ total: number }]>`
      SELECT 
        COUNT(*)::integer AS total
      FROM 
        "GenerateSource" gs
      LEFT JOIN
        "RiskFactors" risk ON risk."id" = gs."riskId"
      ${gerWhereRawPrisma(whereParams)}
    `;

    const [generateSources, totalGenerateSources] = await Promise.all([generateSourcesPromise, totalGenerateSourcesPromise]);

    return GenerateSourceBrowseModelMapper.toModel({
      results: generateSources,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalGenerateSources[0].total) },
    });
  }

  private browseWhere(filters: IGenerateSourceDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`(gs."companyId" = ${filters.companyId} OR gs."system" = true)`, Prisma.sql`gs."deleted_at" IS NULL`, Prisma.sql`gs."status" = 'ACTIVE'`];

    return where;
  }

  private filterWhere(filters: IGenerateSourceDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`
        unaccent(lower(gs."name")) ILIKE unaccent(lower(${search}))
      `);
    }

    if (filters.riskIds?.length) {
      where.push(Prisma.sql`gs."riskId" IN (${Prisma.join(filters.riskIds)})`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: IGenerateSourceDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<GenerateSourceOrderByEnum, string> = {
      [GenerateSourceOrderByEnum.NAME]: 'gs."name"',
      [GenerateSourceOrderByEnum.CREATED_AT]: 'gs."created_at"',
      [GenerateSourceOrderByEnum.UPDATED_AT]: 'gs."updated_at"',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
