import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { IUserBrowseResultModelMapper } from '../../mappers/models/user/user-browse-result.mapper';
import { IUserDAO, UserOrderByEnum } from './user.types';
import { UserBrowseModelMapper } from '../../mappers/models/user/user-browse.mapper';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';

@Injectable()
export class UserDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async checkIfExistWithDifferentToken(params: IUserDAO.CheckIfExistWIthDifferentTokenParams) {
    const user = await this.prisma.user.findFirst({
      where: {
        token: { not: params.token },
        OR: [{ email: params.email }, { googleExternalId: params.googleExternalId || 'not-found' }],
      },
    });

    return user;
  }

  async browseAll({ limit, page, orderBy, filters }: IUserDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const usersPromise = this.prisma.$queryRaw<IUserBrowseResultModelMapper[]>`
      SELECT 
        u.created_at, 
        u.updated_at, 
        u.id, 
        u.name,
        u.email
      FROM 
        "User" u
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)};
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalUsersPromise = this.prisma.$queryRaw<[{ total: number }]>`
      SELECT 
        COUNT(*)::integer AS total
      FROM 
        "User" u
      ${gerWhereRawPrisma(whereParams)}
    `;

    const [users, total] = await Promise.all([usersPromise, totalUsersPromise]);

    return UserBrowseModelMapper.toModel({
      results: users,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(total[0].total) },
      filters: {},
    });
  }

  private browseWhere(filters: IUserDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`w."companyId" = ${filters.companyId}`, Prisma.sql`w."status"::text = ${StatusEnum.ACTIVE}`];

    return where;
  }

  private filterWhere(filters: IUserDAO.BrowseParams['filters']) {
    filters;
    const where: Prisma.Sql[] = [];

    return where;
  }

  private browseOrderBy(orderBy?: IUserDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<UserOrderByEnum, string> = {
      [UserOrderByEnum.NAME]: 'u.name',
      [UserOrderByEnum.EMAIL]: 'u.email',
      [UserOrderByEnum.CREATED_AT]: 'u.created_at',
      [UserOrderByEnum.UPDATED_AT]: 'u.updated_at',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
