import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ITaskDAO, TaskOrderByEnum } from './task.types';
import { ITaskBrowseResultModelMapper } from '../../mappers/models/task/task-browse-result.mapper';
import { ITaskBrowseFilterModelMapper, TaskBrowseFilterModelMapper } from '../../mappers/models/task/task-browse-filter.mapper';
import { TaskBrowseModelMapper } from '../../mappers/models/task/task-browse.mapper';

@Injectable()
export class TaskDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ limit, page, orderBy, filters }: ITaskDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const browseFilterParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...browseFilterParams];

    const tasksPromise = this.prisma.$queryRaw<ITaskBrowseResultModelMapper[]>`
      SELECT 
        task."id" AS task_id
        ,task."text" AS task_text
        ,task."description" AS  task_description
        ,task."created_at" AS task_created_at
        ,task."updated_at" AS task_updated_at
        ,task."done_date" AS task_done_date
        ,task."end_date" AS task_end_date

        ,JSONB_BUILD_OBJECT(
          'id', creator_user."id", 'name', creator_user."name", 'email', creator_user."email"
        ) AS creator_user

        ,JSONB_BUILD_OBJECT(
          'id', responsible_user."id", 'name', responsible_user."name", 'email', responsible_user."email"
        ) AS responsible

        ,JSONB_BUILD_OBJECT(
          'name', st."name", 'color', st."color"
        ) AS status
      FROM 
        "Task" task
      LEFT JOIN
        "User" creator_user ON creator_user."id" = task."creator_id"
      LEFT JOIN
        "User" responsible_user ON responsible_user."id" = task."responsible_id"
      LEFT JOIN
        "Status" st ON st."id" = task."status_id"
      ${
        filters.actionPlanIds?.length
          ? Prisma.sql`
            LEFT JOIN "RiskFactorDataRec" rfd_rec ON rfd_rec."id" = task."action_plan_id"
          `
          : Prisma.sql``
      }
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        task."id"
        ,task."text"
        ,task."description"
        ,task."created_at"
        ,task."updated_at"
        ,task."done_date"
        ,task."end_date"
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalTasksPromise = this.prisma.$queryRaw<[{ total: number } & TaskBrowseFilterModelMapper]>`
      SELECT 
        COUNT(*)::integer AS total
      FROM 
        "Task" task
      LEFT JOIN
        "User" creator_user ON creator_user."id" = task."creator_id"
      LEFT JOIN
        "User" responsible_user ON responsible_user."id" = task."responsible_id"
      LEFT JOIN
        "Status" st ON st."id" = task."status_id"
      ${
        filters.actionPlanIds?.length
          ? Prisma.sql`
            LEFT JOIN "RiskFactorDataRec" rfd_rec ON rfd_rec."id" = task."action_plan_id"
          `
          : Prisma.sql``
      }
      ${gerWhereRawPrisma(whereParams)}
    `;

    const distinctFiltersPromise = this.prisma.$queryRaw<ITaskBrowseFilterModelMapper[]>`
      SELECT 
        json_agg(DISTINCT st) AS status
      FROM 
        "Task" task
      LEFT JOIN
        "Status" st ON st."id" = task."status_id"
      ${gerWhereRawPrisma(browseWhereParams)};
    `;

    const [tasks, totalTasks, distinctFilters] = await Promise.all([tasksPromise, totalTasksPromise, distinctFiltersPromise]);

    return TaskBrowseModelMapper.toModel({
      results: tasks,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalTasks[0].total) },
      filters: distinctFilters[0],
    });
  }

  private browseWhere(filters: ITaskDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`task."company_id" = ${filters.companyId}`];

    return where;
  }

  private filterWhere(filters: ITaskDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`
        unaccent(lower(task."description")) ILIKE unaccent(lower(${search}))
      `);
    }

    if (filters.creatorsIds?.length) {
      where.push(Prisma.sql`creator_user."id" IN (${Prisma.join(filters.creatorsIds)})`);
    }

    if (filters.responsibleIds?.length) {
      where.push(Prisma.sql`responsible_user."id" IN (${Prisma.join(filters.responsibleIds)})`);
    }

    if (filters.statusIds?.length) {
      where.push(Prisma.sql`task."status_id"::text IN (${Prisma.join(filters.statusIds)})`);
    }

    if (filters.actionPlanIds?.length) {
      where.push(Prisma.sql`task."action_plan_id"::text IN (${Prisma.join(filters.actionPlanIds)})`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: ITaskDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<TaskOrderByEnum, string> = {
      [TaskOrderByEnum.UPDATED_AT]: 'task."updated_at"',
      [TaskOrderByEnum.CREATED_AT]: 'task."created_at"',
      [TaskOrderByEnum.DESCRIPTION]: 'task."description"',
      [TaskOrderByEnum.CREATOR]: 'creator_user."name"',
      [TaskOrderByEnum.DONE_DATE]: 'task."done_date"',
      [TaskOrderByEnum.END_DATE]: 'task."end_date"',
      [TaskOrderByEnum.RESPONSIBLE]: 'responsible_user."name"',
      [TaskOrderByEnum.STATUS]: 'st.name',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
