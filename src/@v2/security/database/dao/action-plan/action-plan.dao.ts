import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { CharacterizationTypeEnum, Prisma, StatusEnum } from '@prisma/client';
import { IActionPlanDAO, ActionPlanOrderByEnum } from './action-plan.types';
import { IActionPlanBrowseResultModelMapper } from '../../mappers/models/action-plan/action-plan-browse-result.mapper';
import { IActionPlanBrowseFilterModelMapper } from '../../mappers/models/action-plan/action-plan-browse-filter.mapper';
import { ActionPlanBrowseModelMapper } from '../../mappers/models/action-plan/action-plan-browse.mapper';


@Injectable()
export class ActionPlanDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async browse({ limit, page, orderBy, filters }: IActionPlanDAO.BrowseParams) {
    const pagination = getPagination(page, limit)

    const browseWhereParams = this.browseWhere(filters)
    const filterWhereParams = this.filterWhere(filters)
    const orderByParams = this.browseOrderBy(orderBy)

    const whereParams = [...browseWhereParams, ...filterWhereParams]

    // ${gerWhereRawPrisma(browseWhereParams)}

    const actionplansPromise = this.prisma.$queryRaw<IActionPlanBrowseResultModelMapper[]>`
      WITH "FilteredHierarchyOnHomogeneous" AS (
        SELECT hh."hierarchyId", hh."homogeneousGroupId" 
        FROM "HierarchyOnHomogeneous" AS hh
        WHERE "endDate" IS NULL
      ),
      "FilteredRiskFactorData" AS (
        SELECT 
          rfd."id" as "id",
          rfd."createdAt" as "createdAt",
          rfd."level" as "level",
          rfd."riskId" as "riskId",
          rfd."companyId" as "companyId",
          rfd."endDate" as "endDate",
          rfd."deletedAt" as "deletedAt",
          hg."id" as "hg_id",
          hg."type" as "hg_type",
          hg."name" as "hg_name",
          COALESCE(
            JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', limited_hierarchies."name", 'type', limited_hierarchies.type)) 
            FILTER (WHERE limited_hierarchies."name" IS NOT NULL), '[]'
          )::TEXT AS hierarchies
        FROM 
          "RiskFactorData" rfd
        LEFT JOIN
          "HomogeneousGroup" hg ON hg."id" = rfd."homogeneousGroupId"
        LEFT JOIN
          "FilteredHierarchyOnHomogeneous" hh ON hh."homogeneousGroupId" = hg."id"
        LEFT JOIN 
          "Hierarchy" h ON h."id" = hh."hierarchyId"
        LEFT JOIN 
          "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId"
        LEFT JOIN 
          "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
        LEFT JOIN 
          "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
        LEFT JOIN 
          "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
        LEFT JOIN 
          "Hierarchy" h_parent_5 ON h_parent_5."id" = h_parent_4."parentId"
        LEFT JOIN 
          "Hierarchy" h_children_1 ON h_children_1."parentId" = h."id"
        LEFT JOIN
          "Hierarchy" h_children_2 ON h_children_2."parentId" = h_children_1."id"
        LEFT JOIN
          "Hierarchy" h_children_3 ON h_children_3."parentId" = h_children_2."id"
        LEFT JOIN
          "Hierarchy" h_children_4 ON h_children_4."parentId" = h_children_3."id"
        LEFT JOIN
          "Hierarchy" h_children_5 ON h_children_5."parentId" = h_children_4."id"
        LEFT JOIN LATERAL (
          SELECT lateral_h."name", lateral_h."type"
          FROM "Hierarchy" lateral_h
          WHERE lateral_h."id" IN (h."id", h_parent_1."id", h_parent_2."id", h_parent_3."id", h_parent_4."id", h_children_1."id", h_children_2."id", h_children_3."id", h_children_4."id", h_children_5."id")
        ) AS limited_hierarchies ON true
        ${gerWhereRawPrisma(browseWhereParams)}
        GROUP BY 
          rfd."id",
          rfd."createdAt",
          rfd."level",
          rfd."riskId",
          rfd."companyId",
          rfd."endDate",
          rfd."deletedAt",
          hg."id",
          hg."type",
          hg."name"
      )
      SELECT 
        rec."id" AS rec_id,
        rfd."id" AS rfd_id,
        rfd."createdAt" AS rfd_created_at, 
        rfd."level" AS rfd_level,
        rec."recName" AS rec_name,
        rfd_rec."updated_at" AS rfd_rec_updated_at,
        rfd_rec."startDate" AS rfd_rec_start_date,
        rfd_rec."doneDate" AS rfd_rec_done_date,
        rfd_rec."canceledDate" AS rfd_rec_canceled_date,
        rfd_rec."endDate" AS rfd_rec_endDate,
        rfd_rec."status" AS rfd_rec_status,
        w."id" AS w_id,
        dd."months_period_level_2",
        dd."months_period_level_3",
        dd."months_period_level_4",
        dd."months_period_level_5",
        risk."name" AS risk_name,
        risk."type" AS risk_type,
        rfd."hg_type" AS hg_type,
        rfd."hg_name" AS hg_name,
        cc."name" AS cc_name,
        cc."type" AS cc_type,
        rfd."hierarchies"::JSONB AS hierarchies,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', gs."name")) 
          FILTER (WHERE gs."name" IS NOT NULL), '[]'
        ) AS generateSources
      FROM 
        "FilteredRiskFactorData" rfd
      JOIN 
        "_recs" rec_to_rfd ON rec_to_rfd."B" = rfd."id"
      LEFT JOIN
        "RecMed" rec ON rec."id" = rec_to_rfd."A"
      LEFT JOIN
        "RiskFactors" risk ON risk."id" = rfd."riskId"
      LEFT JOIN
        "_GenerateSourceToRiskFactorData" gs_to_rfd ON gs_to_rfd."B" = rfd."id"
      LEFT JOIN
        "GenerateSource" gs ON gs."id" = gs_to_rfd."A"
      LEFT JOIN 
        "RiskFactorDataRec" rfd_rec ON rfd_rec."riskFactorDataId" = rfd."id"
      LEFT JOIN
        "CompanyCharacterization" cc ON cc."id" = rfd."hg_id"
      LEFT JOIN
        "Workspace" w ON w."companyId" = rfd."companyId"
      LEFT JOIN
        "DocumentData" dd ON dd."workspaceId" = w."id"
      ${gerWhereRawPrisma(filterWhereParams)}
      GROUP BY 
        rec."id",
        rec."recName",
        rfd."id",
        rfd."createdAt",
        rfd."level",
        rfd."hierarchies",
        rfd_rec."updated_at",
        rfd_rec."startDate",
        rfd_rec."doneDate",
        rfd_rec."canceledDate",
        rfd_rec."endDate",
        rfd_rec."status",
        w."id",
        dd."months_period_level_2",
        dd."months_period_level_3",
        dd."months_period_level_4",
        dd."months_period_level_5",
        risk."name",
        risk."type",
        rfd."hg_type",
        rfd."hg_name",
        cc."name",
        cc."type"
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    // const totalActionPlansPromise = this.prisma.$queryRaw<{ total: number }[]>`
    //   SELECT COUNT(*) AS total FROM "CompanyCharacterization" cc
    //   ${gerWhereRawPrisma(whereParams)};
    // `;

    // const distinctFiltersPromise = this.prisma.$queryRaw<IActionPlanBrowseFilterModelMapper[]>`
    //   SELECT 
    //     array_agg(DISTINCT cc.type) AS filter_types,
    //     json_agg(DISTINCT s) AS stages
    //   FROM "CompanyCharacterization" cc
    //   LEFT JOIN "Status" s ON cc."stageId" = s.id
    //   ${gerWhereRawPrisma(browseWhereParams)};
    // `;

    const [actionplans, totalActionPlans, distinctFilters] = await Promise.all([actionplansPromise, null, null])

    return actionplans

    return ActionPlanBrowseModelMapper.toModel({
      results: actionplans,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalActionPlans[0].total) },
      filters: distinctFilters[0],
    })
  }

  private browseWhere(filters: IActionPlanDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`rfd."companyId" = ${filters.companyId}`,
      Prisma.sql`rfd."endDate" IS NULL`,
      Prisma.sql`rfd."deletedAt" IS NULL`,
    ]

    return where
  }

  private filterWhere(filters: IActionPlanDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = []

    if (filters.search) {
      const search = `%${filters.search}%`
      where.push(Prisma.sql`unaccent(lower(rfd.hg_name)) ILIKE unaccent(lower(${search}))`)
    }

    // if (filters.stageIds?.length) {
    //   const includeNull = filters.stageIds.includes(0)

    //   if (includeNull) {
    //     if (filters.stageIds.length === 1) where.push(Prisma.sql`cc."stageId" IS NULL`)
    //     else where.push(Prisma.sql`cc."stageId" IN (${Prisma.join(filters.stageIds.filter(Boolean))}) OR cc."stageId" IS NULL`)
    //   }

    //   if (!includeNull) {
    //     where.push(Prisma.sql`cc."stageId" IN (${Prisma.join(filters.stageIds)})`)
    //   }
    // }

    return where
  }

  private browseOrderBy(orderBy?: IActionPlanDAO.BrowseParams['orderBy']) {
    if (!orderBy) return []

    const desiredOrder = [CharacterizationTypeEnum.GENERAL, CharacterizationTypeEnum.ADMINISTRATIVE, CharacterizationTypeEnum.OPERATION, CharacterizationTypeEnum.SUPPORT, CharacterizationTypeEnum.WORKSTATION, CharacterizationTypeEnum.ACTIVITIES, CharacterizationTypeEnum.EQUIPMENT]

    const map: Record<ActionPlanOrderByEnum, string> = {
      [ActionPlanOrderByEnum.NAME]: 'cc.name',
      [ActionPlanOrderByEnum.TYPE]: `CASE cc.type ${desiredOrder.map((type, index) => `WHEN '${type}' THEN ${index}`).join(' ')} ELSE ${desiredOrder.length} END`,
      [ActionPlanOrderByEnum.CREATED_AT]: 'cc.created_at',
      [ActionPlanOrderByEnum.UPDATED_AT]: 'cc.updated_at',
      [ActionPlanOrderByEnum.DONE_AT]: 'cc.done_at',
      [ActionPlanOrderByEnum.STAGE]: 'st.name',
      [ActionPlanOrderByEnum.ORDER]: 'cc.order',
      [ActionPlanOrderByEnum.PHOTOS]: 'total_photos',
      [ActionPlanOrderByEnum.RISKS]: 'total_risks',
      [ActionPlanOrderByEnum.HIERARCHY]: 'total_hierarchies',
      [ActionPlanOrderByEnum.PROFILES]: 'total_profiles',
    }

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }))

    return orderByRaw
  }
}
