import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Prisma, StatusEnum } from '@prisma/client';
import { IHierarchyBrowseShortResultModelMapper } from '../../../mappers/models/hierarchy/hierarchy-browse-short-result.mapper';
import { HierarchyBrowseShortModelMapper } from '../../../mappers/models/hierarchy/hierarchy-browse-short.mapper';
import { IHierarchyDAO } from '../hierarchy.types';

export class HierarchyBrowseShortQuery {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browseShort({ limit, page, filters }: IHierarchyDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const browseFilterParams = this.filterWhere(filters);

    const whereParams = [...browseWhereParams, ...browseFilterParams];

    const hierarchysPromise = this.prisma.$queryRaw<IHierarchyBrowseShortResultModelMapper[]>`
      with recursive "FilteredHierarchy" AS (
        SELECT
          h."id",
          h."name",
          h."type",
          h."parentId"
        FROM
          "Hierarchy" h
        LEFT JOIN
          "_HierarchyToWorkspace" h_t_w ON h_t_w."A" = h."id"
        LEFT JOIN
          "Workspace" workspace ON workspace."id" = h_t_w."B"
        LEFT JOIN
          "Hierarchy" h_children_1 ON h_children_1."parentId" = h."id"
        LEFT JOIN
          "_HierarchyToWorkspace" h_t_w_1 ON h_t_w_1."A" = h_children_1."id"
        LEFT JOIN
          "Hierarchy" h_children_2 ON h_children_2."parentId" = h_children_1."id"
        LEFT JOIN
          "_HierarchyToWorkspace" h_t_w_2 ON h_t_w_2."A" = h_children_2."id"
        LEFT JOIN
          "Hierarchy" h_children_3 ON h_children_3."parentId" = h_children_2."id"
        LEFT JOIN
          "_HierarchyToWorkspace" h_t_w_3 ON h_t_w_3."A" = h_children_3."id"
        LEFT JOIN
          "Hierarchy" h_children_4 ON h_children_4."parentId" = h_children_3."id"
        LEFT JOIN
          "_HierarchyToWorkspace" h_t_w_4 ON h_t_w_4."A" = h_children_4."id"
        LEFT JOIN
          "Hierarchy" h_children_5 ON h_children_5."parentId" = h_children_4."id"
        LEFT JOIN
          "_HierarchyToWorkspace" h_t_w_5 ON h_t_w_5."A" = h_children_5."id"
        ${gerWhereRawPrisma(whereParams)}
        GROUP BY
          h."id",
          h."name",
          h."type",
          h."parentId"
      ), HierarchyCTE AS (
        SELECT 
          h."id",
          h."name",
          h."type",
          h."parentId",
          1 AS "level",
          CAST(h.name AS VARCHAR) AS path
        FROM 
          "FilteredHierarchy" h
        WHERE 
          h."parentId" IS NULL

        UNION ALL

        SELECT 
          h."id",
          h."name",
          h."type",
          h."parentId",
          hc."level" + 1,
          CAST(hc."path" || ' > ' || h."name" AS VARCHAR) AS path
        FROM 
          "FilteredHierarchy" h
        INNER JOIN 
          HierarchyCTE hc ON  h."parentId" = hc."id"
      )
      SELECT 
        h."id" as hierarchy_id,
        h."name" as hierarchy_name,
        h."type"  as hierarchy_type,
        h."parentId",
        h."level",
        h."path"
      FROM 
        HierarchyCTE h
      ORDER BY h."path" ASC, h."level" ASC
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalHierarchysPromise = this.prisma.$queryRaw<[{ total: number }]>`
      SELECT 
        COUNT(DISTINCT (h."id"))::integer AS total
      FROM
        "Hierarchy" h
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w ON h_t_w."A" = h."id"
      LEFT JOIN
        "Workspace" workspace ON workspace."id" = h_t_w."B"
      LEFT JOIN
        "Hierarchy" h_children_1 ON h_children_1."parentId" = h."id"
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w_1 ON h_t_w_1."A" = h_children_1."id"
      LEFT JOIN
        "Hierarchy" h_children_2 ON h_children_2."parentId" = h_children_1."id"
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w_2 ON h_t_w_2."A" = h_children_2."id"
      LEFT JOIN
        "Hierarchy" h_children_3 ON h_children_3."parentId" = h_children_2."id"
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w_3 ON h_t_w_3."A" = h_children_3."id"
      LEFT JOIN
        "Hierarchy" h_children_4 ON h_children_4."parentId" = h_children_3."id"
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w_4 ON h_t_w_4."A" = h_children_4."id"
      LEFT JOIN
        "Hierarchy" h_children_5 ON h_children_5."parentId" = h_children_4."id"
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w_5 ON h_t_w_5."A" = h_children_5."id"
      ${gerWhereRawPrisma(whereParams)}
    `;

    const [hierarchys, totalHierarchys] = await Promise.all([hierarchysPromise, totalHierarchysPromise]);

    return HierarchyBrowseShortModelMapper.toModel({
      results: hierarchys,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalHierarchys[0].total) },
    });
  }

  private browseWhere(filters: IHierarchyDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`h."companyId" = ${filters.companyId}`, Prisma.sql`h."status"::text = ${StatusEnum.ACTIVE}`];

    return where;
  }

  private filterWhere(filters: IHierarchyDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`
        (
          unaccent(lower(h."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_children_1."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_children_2."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_children_3."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_children_4."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_children_5."name")) ILIKE unaccent(lower(${search}))
        )
      `);
    }

    if (filters.workspaceIds?.length) {
      where.push(Prisma.sql`
        (
          h_t_w."B" IN(${Prisma.join(filters.workspaceIds)}) OR 
          h_t_w_1."B" IN(${Prisma.join(filters.workspaceIds)}) OR 
          h_t_w_2."B" IN(${Prisma.join(filters.workspaceIds)}) OR 
          h_t_w_3."B" IN(${Prisma.join(filters.workspaceIds)}) OR 
          h_t_w_4."B" IN(${Prisma.join(filters.workspaceIds)}) OR 
          h_t_w_5."B" IN(${Prisma.join(filters.workspaceIds)})
        )  
      `);
    }

    if (filters.type?.length) {
      where.push(Prisma.sql`h."type"::text IN (${Prisma.join(filters.type)})`);
    }

    return where;
  }
}
