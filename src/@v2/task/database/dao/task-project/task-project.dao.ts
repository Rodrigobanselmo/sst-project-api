import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TaskProjectBrowseFilterModelMapper } from '../../mappers/models/task-project/task-project-browse-filter.mapper';
import { ITaskProjectBrowseResultModelMapper } from '../../mappers/models/task-project/task-project-browse-result.mapper';
import { TaskProjectBrowseModelMapper } from '../../mappers/models/task-project/task-project-browse.mapper';
import { TaskProjectReadModelMapper } from '../../mappers/models/task-project/task-project-read.mapper';
import { ITaskProjectDAO, TaskProjectOrderByEnum } from './task-project.types';

@Injectable()
export class TaskProjectDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async read({ id, companyId }: ITaskProjectDAO.ReadParams) {
    const task = await this.prisma.taskProject.findFirst({
      where: {
        id,
        company_id: companyId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        members: { select: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!task) return null;

    return TaskProjectReadModelMapper.toModel(task);
  }

  async browse({ limit, page, orderBy, filters }: ITaskProjectDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const browseFilterParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...browseFilterParams];

    const tasksPromise = this.prisma.$queryRaw<ITaskProjectBrowseResultModelMapper[]>`
      SELECT 
        task_project."id" AS task_project_id
        ,task_project."name" AS  task_project_name
        ,task_project."description" AS  task_project_description
        ,task_project."status" AS task_project_status
        ,task_project."created_at" AS task_project_created_at
        ,task_project."updated_at" AS task_project_updated_at
        ,creator_user."id" AS creator_user_id
        ,array_agg(DISTINCT member."user_id") AS task_project_members
      FROM 
        "TaskProject" task_project
      LEFT JOIN "User" creator_user ON creator_user."id" = task_project."user_id"
      LEFT JOIN "TaskProjectMembers" member ON member."project_id" = task_project."id"
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        task_project."id"
        ,task_project."name"
        ,task_project."description"
        ,task_project."status"
        ,task_project."created_at"
        ,task_project."updated_at"
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalTaskProjectsPromise = this.prisma.$queryRaw<[{ total: number } & TaskProjectBrowseFilterModelMapper]>`
      SELECT 
        COUNT(*)::integer AS total
      FROM 
        "TaskProject" task_project
      ${
        filters.membersIds?.length
          ? Prisma.sql`
            LEFT JOIN "User" creator_user ON creator_user."id" = task_project."user_id"
            LEFT JOIN "TaskProjectMembers" member ON member."project_id" = task_project."id"
          `
          : Prisma.sql``
      }
      ${gerWhereRawPrisma(whereParams)}
    `;

    const [tasks, totalTaskProjects] = await Promise.all([tasksPromise, totalTaskProjectsPromise]);

    return TaskProjectBrowseModelMapper.toModel({
      results: tasks,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalTaskProjects[0].total) },
    });
  }

  private browseWhere(filters: ITaskProjectDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`task_project."company_id" = ${filters.companyId}`, Prisma.sql`task_project."deleted_at" IS NULL`];

    return where;
  }

  private filterWhere(filters: ITaskProjectDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`
        unaccent(lower(task_project."description")) ILIKE unaccent(lower(${search}))
        OR unaccent(lower(task_project."name")) ILIKE unaccent(lower(${search}))
      `);
    }

    if (filters.membersIds?.length) {
      where.push(Prisma.sql`
        creator_user."id" IN (${Prisma.join(filters.membersIds)})
        OR member."user_id" IN (${Prisma.join(filters.membersIds)})
      `);
    }

    return where;
  }

  private browseOrderBy(orderBy?: ITaskProjectDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<TaskProjectOrderByEnum, string> = {
      [TaskProjectOrderByEnum.UPDATED_AT]: 'task_project."updated_at"',
      [TaskProjectOrderByEnum.CREATED_AT]: 'task_project."created_at"',
      [TaskProjectOrderByEnum.DESCRIPTION]: 'task_project."description"',
      [TaskProjectOrderByEnum.STATUS]: 'task_project.status',
      [TaskProjectOrderByEnum.NAME]: 'task_project."done_date"',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
