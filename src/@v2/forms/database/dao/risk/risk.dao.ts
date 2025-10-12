import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IRiskBrowseResultModelMapper } from '../../mappers/models/risk/risk-browse-result.mapper';
import { RiskBrowseModelMapper } from '../../mappers/models/risk/risk-browse.mapper';
import { IRiskDAO, RiskOrderByEnum } from './risk.types';

@Injectable()
export class RiskDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ limit, page, orderBy, filters }: IRiskDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const risksPromise = this.prisma.$queryRaw<IRiskBrowseResultModelMapper[]>`
      SELECT
        rf."id",
        rf."name",
        rf."severity",
        rf."type"
      FROM
        "RiskFactors" rf
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalRisksPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total FROM "RiskFactors" rf
      ${gerWhereRawPrisma(whereParams)};
    `;

    const [risks, totalRisks] = await Promise.all([risksPromise, totalRisksPromise]);

    return RiskBrowseModelMapper.toModel({
      results: risks,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalRisks[0].total) },
    });
  }

  private browseWhere(filters: IRiskDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    where.push(Prisma.sql`rf."companyId" = ${filters.companyId} OR rf."system" = true`);
    where.push(Prisma.sql`rf."status" = 'ACTIVE'`);
    where.push(Prisma.sql`rf."deleted_at" IS NULL`);
    // where.push(Prisma.sql`rf."type" = 'ERG'`);

    // Filter for PSICOSOCIAL subtype
    where.push(Prisma.sql`
      EXISTS (
        SELECT 1 FROM "RiskToRiskSubType" rrst
        INNER JOIN "RiskSubType" rst ON rrst."sub_type_id" = rst."id"
        WHERE rrst."risk_id" = rf."id" AND (rst."sub_type" = 'PSICOSOCIAL' OR rst."sub_type" = 'INDICADORES_SAUDE' OR rst."sub_type" = 'INDICADORES_CONTROLES')
      )
    `);

    return where;
  }

  private filterWhere(filters: IRiskDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`unaccent(lower(rf."name")) ILIKE unaccent(lower(${search}))`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: IRiskDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<RiskOrderByEnum, string> = {
      [RiskOrderByEnum.NAME]: 'rf."name"',
      [RiskOrderByEnum.SEVERITY]: 'rf."severity"',
      [RiskOrderByEnum.TYPE]: 'rf."type"',
      [RiskOrderByEnum.CREATED_AT]: 'rf."created_at"',
      [RiskOrderByEnum.UPDATED_AT]: 'rf."updated_at"',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
