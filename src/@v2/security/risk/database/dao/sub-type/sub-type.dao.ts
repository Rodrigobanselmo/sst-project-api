import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ISubTypeBrowseResultModelMapper } from '../../mappers/models/sub-type/sub-type-browse-result.mapper';
import { SubTypeBrowseModelMapper } from '../../mappers/models/sub-type/sub-type-browse.mapper';
import { ISubTypeDAO, SubTypeOrderByEnum } from './sub-type.types';

@Injectable()
export class SubTypeDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ limit, page, orderBy, filters }: ISubTypeDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const SubTypesPromise = this.prisma.$queryRaw<ISubTypeBrowseResultModelMapper[]>`
      SELECT
        sub_risk."id" 
        ,sub_risk."name"
      FROM
        "RiskSubType" sub_risk
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalSubTypesPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total FROM "RiskSubType" sub_risk
      ${gerWhereRawPrisma(whereParams)};
    `;

    const [SubTypes, totalSubTypes] = await Promise.all([SubTypesPromise, totalSubTypesPromise]);

    return SubTypeBrowseModelMapper.toModel({
      results: SubTypes,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalSubTypes[0].total) },
    });
  }

  private browseWhere(_: ISubTypeDAO.BrowseParams['filters']) {
    const where = [];

    return where;
  }

  private filterWhere(filters: ISubTypeDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`unaccent(lower(sub_risk.name)) ILIKE unaccent(lower(${search}))`);
    }

    if (filters.types?.length) {
      const types = filters.types.map((type) => type.toLowerCase());
      where.push(Prisma.sql`lower(sub_risk.type) = ANY(${types})`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: ISubTypeDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<SubTypeOrderByEnum, string> = {
      [SubTypeOrderByEnum.NAME]: 'sub_risk.name',
      [SubTypeOrderByEnum.TYPE]: 'sub_risk.type',
      [SubTypeOrderByEnum.CREATED_AT]: 'sub_risk.created_at',
      [SubTypeOrderByEnum.UPDATED_AT]: 'sub_risk.updated_at',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
