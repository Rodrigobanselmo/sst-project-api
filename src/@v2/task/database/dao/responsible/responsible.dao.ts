import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IResponsibleDAO, ResponsibleOrderByEnum } from './responsible.types';
import { ITaskResponsibleBrowseResultModelMapper } from '../../mappers/models/responsible/task-responsible-browse-result.mapper';
import { TaskResponsibleBrowseModelMapper } from '../../mappers/models/responsible/task-responsible-browse.mapper';

@Injectable()
export class ResponsibleDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ limit, page, orderBy, filters }: IResponsibleDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const orderByParams = this.browseOrderBy(orderBy);
    const whereUser = [...this.browseUserWhere(filters), ...this.filterUserWhere(filters)];
    const whereEmployee = [...this.browseEmployeeWhere(filters), ...this.filterEmployeeWhere(filters)];

    const usersPromise = this.prisma.$queryRaw<ITaskResponsibleBrowseResultModelMapper[]>`
      SELECT
        user_id,
        employee_id,
        row_name,
        row_email
      FROM (
        SELECT
          u."id" AS user_id,
          u."name" AS row_name,
          u."email" AS row_email,
          NULL AS employee_id
        FROM
          "User" u
        LEFT JOIN
          "UserCompany" up ON u.id = up."userId" AND up.status <> 'INACTIVE'
        ${gerWhereRawPrisma(whereUser)}

        UNION ALL

        SELECT
          NULL AS user_id,
          employee."name" AS row_name,
          employee."email" AS row_email,
          employee."id" AS employee_id
        FROM
          "Employee" employee
        ${gerWhereRawPrisma(whereEmployee)}
      ) AS combined_results
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalUsersPromise = this.prisma.$queryRaw<[{ total: number }]>`
      SELECT COUNT(*) AS total_rows
      FROM (
        SELECT
          u."id" AS user_id  
        FROM 
          "User" u
        LEFT JOIN 
          "UserCompany" up ON u.id = up."userId" AND up.status <> 'INACTIVE'
        ${gerWhereRawPrisma(this.browseUserWhere(filters))}

        UNION ALL

        SELECT
          employee."id" AS employee_id
        FROM 
          "Employee" employee
        ${gerWhereRawPrisma(this.browseEmployeeWhere(filters))} 
      ) AS subquery;
    `;

    const [users, totalUsers] = await Promise.all([usersPromise, totalUsersPromise]);

    return TaskResponsibleBrowseModelMapper.toModel({
      results: users,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalUsers[0].total) },
    });
  }

  private browseUserWhere(filters: IResponsibleDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`up."companyId" = ${filters.companyId}`, Prisma.sql`u."name" IS NOT NULL`];

    return where;
  }

  private browseEmployeeWhere(filters: IResponsibleDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`employee."companyId" = ${filters.companyId}`, Prisma.sql`employee."deleted_at" IS NULL`, Prisma.sql`employee."name" IS NOT NULL`, Prisma.sql`employee."user_id" IS NULL`];

    return where;
  }

  private filterUserWhere(filters: IResponsibleDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`
        unaccent(lower(u."name")) ILIKE unaccent(lower(${search}))
      `);
    }

    return where;
  }

  private filterEmployeeWhere(filters: IResponsibleDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`
        unaccent(lower(employee."name")) ILIKE unaccent(lower(${search}))
      `);
    }

    return where;
  }

  private browseOrderBy(orderBy?: IResponsibleDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<ResponsibleOrderByEnum, string> = {
      [ResponsibleOrderByEnum.NAME]: 'row_name',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));
    return orderByRaw;
  }
}
