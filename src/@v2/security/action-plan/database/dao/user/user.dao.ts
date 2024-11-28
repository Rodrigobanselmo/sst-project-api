import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponsibleBrowseFilterModelMapper } from '../../mappers/models/responsible/responsible-browse-filter.mapper';
import { IResponsibleBrowseResultModelMapper } from '../../mappers/models/responsible/responsible-browse-result.mapper';
import { ResponsibleBrowseModelMapper } from '../../mappers/models/responsible/responsible-browse.mapper';
import { IUserDAO, UserOrderByEnum } from './user.types';

@Injectable()
export class UserDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async browse({ limit, page, orderBy, filters }: IUserDAO.BrowseParams) {
    const pagination = getPagination(page, limit)

    const browseWhereParams = this.browseWhere(filters)
    const browseFilterParams = this.filterWhere(filters)
    const orderByParams = this.browseOrderBy(orderBy)

    const whereParams = [...browseWhereParams, ...browseFilterParams]

    const usersPromise = this.prisma.$queryRaw<IResponsibleBrowseResultModelMapper[]>`
      SELECT 
        u."id" AS user_id,
        u."name" AS user_name,
        u."email" AS user_email
      FROM 
        "User" u
      LEFT JOIN
        "UserCompany" up 
          ON up."userId" = u."id" 
          AND up."status" <> 'INACTIVE'
          AND up."companyId" = ${filters.companyId}
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalUsersPromise = this.prisma.$queryRaw<[{ total: number } & ResponsibleBrowseFilterModelMapper]>`
      SELECT 
        COUNT(*)::integer AS total
        FROM 
        "User" u
      LEFT JOIN
        "UserCompany" up 
          ON up."userId" = u."id" 
          AND up."status" <> 'INACTIVE'
          AND up."companyId" = ${filters.companyId}
      ${gerWhereRawPrisma(whereParams)}
    `;

    const [users, totalUsers] = await Promise.all([usersPromise, totalUsersPromise])

    return ResponsibleBrowseModelMapper.toModel({
      results: users,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalUsers[0].total) },
      filters: totalUsers[0],
    })
  }

  private browseWhere(filters: IUserDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`up."companyId" = ${filters.companyId}`,
    ]

    return where
  }

  private filterWhere(filters: IUserDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = []

    if (filters.search) {
      const search = `%${filters.search}%`
      where.push(Prisma.sql`
        unaccent(lower(u."name")) ILIKE unaccent(lower(${search}))
      `)
    }

    return where
  }

  private browseOrderBy(orderBy?: IUserDAO.BrowseParams['orderBy']) {
    if (!orderBy) return []

    const map: Record<UserOrderByEnum, string> = {
      [UserOrderByEnum.NAME]: 'u."name"',
    }

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }))
    return orderByRaw
  }
}
