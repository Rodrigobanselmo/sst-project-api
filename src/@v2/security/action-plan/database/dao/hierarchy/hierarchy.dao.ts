import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { IHierarchyBrowseResultModelMapper } from '../../mappers/models/hierarchy/hierarchy-browse-result.mapper';
import { HierarchyBrowseModelMapper } from '../../mappers/models/hierarchy/hierarchy-browse.mapper';
import { HierarchyOrderByEnum, IHierarchyDAO } from './hierarchy.types';


@Injectable()
export class HierarchyDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async browse({ limit, page, orderBy, filters }: IHierarchyDAO.BrowseParams) {
    const pagination = getPagination(page, limit)

    const browseWhereParams = this.browseWhere(filters)
    const browseFilterParams = this.filterWhere(filters)
    const orderByParams = this.browseOrderBy(orderBy)

    const whereParams = [...browseWhereParams, ...browseFilterParams]

    const hierarchysPromise = this.prisma.$queryRaw<IHierarchyBrowseResultModelMapper[]>`
      SELECT 
        hierarchy."id" AS hierarchy_id,
        hierarchy."name" AS hierarchy_name,
        hierarchy."type" AS  hierarchy_type,
        h_parent_1."id" AS h_parent_1_id,
        h_parent_1."name" AS h_parent_1_name,
        h_parent_1."type" AS h_parent_1_type,
        h_parent_2."id" AS h_parent_2_id,
        h_parent_2."name" AS h_parent_2_name,
        h_parent_2."type" AS h_parent_2_type,
        h_parent_3."id" AS h_parent_3_id,
        h_parent_3."name" AS h_parent_3_name,
        h_parent_3."type" AS h_parent_3_type,
        h_parent_4."id" AS h_parent_4_id,
        h_parent_4."name" AS h_parent_4_name,
        h_parent_4."type" AS h_parent_4_type,
        h_parent_5."id" AS h_parent_5_id,
        h_parent_5."name" AS h_parent_5_name,
        h_parent_5."type" AS h_parent_5_type
      FROM 
        "Hierarchy" hierarchy
      LEFT JOIN
        "Company" company ON company."id" = hierarchy."companyId"
      LEFT JOIN
        "_HierarchyToWorkspace" hierarchy_to_workspace ON hierarchy_to_workspace."A" = hierarchy."id"
      LEFT JOIN
        "Workspace" workspace ON workspace."id" = hierarchy_to_workspace."B"
      LEFT JOIN 
        "Hierarchy" h_parent_1 ON h_parent_1."id" = hierarchy."parentId"
      LEFT JOIN 
        "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
      LEFT JOIN 
        "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
      LEFT JOIN 
        "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
      LEFT JOIN 
        "Hierarchy" h_parent_5 ON h_parent_5."id" = h_parent_4."parentId"
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        hierarchy."id",
        hierarchy."name",
        hierarchy."type",
        h_parent_1."id",
        h_parent_1."name",
        h_parent_1."type",
        h_parent_2."id",
        h_parent_2."name",
        h_parent_2."type",
        h_parent_3."id",
        h_parent_3."name",
        h_parent_3."type",
        h_parent_4."id",
        h_parent_4."name",
        h_parent_4."type",
        h_parent_5."id",
        h_parent_5."name",
        h_parent_5."type"
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalHierarchysPromise = this.prisma.$queryRaw<[{ total: number }]>`
      SELECT 
        COUNT(DISTINCT (hierarchy."id"))::integer AS total
      FROM 
        "Hierarchy" hierarchy
      LEFT JOIN
        "Company" company ON company."id" = hierarchy."companyId"
      LEFT JOIN
        "_HierarchyToWorkspace" hierarchy_to_workspace ON hierarchy_to_workspace."A" = hierarchy."id"
      LEFT JOIN
        "Workspace" workspace ON workspace."id" = hierarchy_to_workspace."B"
      ${gerWhereRawPrisma(whereParams)}
    `;

    const [hierarchys, totalHierarchys] = await Promise.all([hierarchysPromise, totalHierarchysPromise])

    return HierarchyBrowseModelMapper.toModel({
      results: hierarchys,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalHierarchys[0].total) },
    })
  }

  private browseWhere(filters: IHierarchyDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`hierarchy."companyId" = ${filters.companyId}`,
      Prisma.sql`hierarchy."status"::text = ${StatusEnum.ACTIVE}`,
    ]

    return where
  }

  private filterWhere(filters: IHierarchyDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = []

    if (filters.search) {
      const search = `%${filters.search}%`
      where.push(Prisma.sql`
        unaccent(lower(hierarchy."name")) ILIKE unaccent(lower(${search}))
      `)
    }

    if (filters.workspaceIds?.length) {
      where.push(Prisma.sql`workspace."id" IN (${Prisma.join(filters.workspaceIds)})`)
    }


    return where
  }

  private browseOrderBy(orderBy?: IHierarchyDAO.BrowseParams['orderBy']) {
    if (!orderBy) return []

    const desiredTypeOrder = [HierarchyTypeEnum.DIRECTORY, HierarchyTypeEnum.MANAGEMENT, HierarchyTypeEnum.SECTOR, HierarchyTypeEnum.SUB_SECTOR, HierarchyTypeEnum.OFFICE, HierarchyTypeEnum.SUB_OFFICE]

    const map: Record<HierarchyOrderByEnum, string> = {
      [HierarchyOrderByEnum.UPDATED_AT]: 'hierarchy."updated_at"',
      [HierarchyOrderByEnum.CREATED_AT]: 'hierarchy."created_at"',
      [HierarchyOrderByEnum.NAME]: 'hierarchy."name"',
      [HierarchyOrderByEnum.PARENT_NAME_1]: 'h_parent_1."name"',
      [HierarchyOrderByEnum.PARENT_NAME_2]: 'h_parent_2."name"',
      [HierarchyOrderByEnum.PARENT_NAME_3]: 'h_parent_3."name"',
      [HierarchyOrderByEnum.PARENT_NAME_4]: 'h_parent_4."name"',
      [HierarchyOrderByEnum.PARENT_NAME_5]: 'h_parent_5."name"',
      [HierarchyOrderByEnum.TYPE]: `CASE hierarchy."type" ${desiredTypeOrder.map((type, index) => `WHEN '${type}' THEN ${index}`).join(' ')} ELSE ${desiredTypeOrder.length} END`,
    }

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }))

    return orderByRaw
  }
}
