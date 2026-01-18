import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { IWorkspaceBrowseResultModelMapper } from '../../mappers/models/workspace/workspace-all-browse-result.mapper';
import { WorkspaceBrowseModelMapper } from '../../mappers/models/workspace/workspace-all-browse.mapper';
import { IWorkspaceDAO, WorkspaceOrderByEnum } from './workspace.types';

@Injectable()
export class WorkspaceDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browseAll({ orderBy, filters }: IWorkspaceDAO.BrowseParams) {
    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const workspacesPromise = this.prisma.$queryRaw<IWorkspaceBrowseResultModelMapper[]>`
      SELECT
        w.created_at,
        w.updated_at,
        w.id,
        w.name,
        w.status,
        w."logoUrl"
      FROM
        "Workspace" w
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)};
    `;

    const [workspaces] = await Promise.all([workspacesPromise]);

    return WorkspaceBrowseModelMapper.toModel({
      results: workspaces,
      filters: {},
    });
  }

  private browseWhere(filters: IWorkspaceDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`w."companyId" = ${filters.companyId}`, Prisma.sql`w."status"::text = ${StatusEnum.ACTIVE}`];

    return where;
  }

  private filterWhere(filters: IWorkspaceDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];
    filters;

    return where;
  }

  private browseOrderBy(orderBy?: IWorkspaceDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<WorkspaceOrderByEnum, string> = {
      [WorkspaceOrderByEnum.NAME]: 'w.name',
      [WorkspaceOrderByEnum.CREATED_AT]: 'w.created_at',
      [WorkspaceOrderByEnum.UPDATED_AT]: 'w.updated_at',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
