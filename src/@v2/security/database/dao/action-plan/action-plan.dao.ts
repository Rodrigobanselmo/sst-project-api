import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IActionPlanBrowseResultModelMapper } from '../../mappers/models/action-plan/action-plan-browse-result.mapper';
import { ActionPlanBrowseModelMapper } from '../../mappers/models/action-plan/action-plan-browse.mapper';
import { ActionPlanOrderByEnum, IActionPlanDAO } from './action-plan.types';


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

    const actionplansPromise = this.prisma.$queryRaw<IActionPlanBrowseResultModelMapper[]>`
      SELECT 
        rec."id" AS rec_id,
        rec."recName" AS rec_name,
        rec."recType" AS rec_type,
        rfd."id" AS rfd_id,
        rfd."createdAt" AS rfd_created_at, 
        rfd."level" AS rfd_level,
        rfd_rec."updated_at" AS rfd_rec_updated_at,
        rfd_rec."startDate" AS rfd_rec_start_date,
        rfd_rec."doneDate" AS rfd_rec_done_date,
        rfd_rec."canceledDate" AS rfd_rec_canceled_date,
        rfd_rec."endDate" AS rfd_rec_end_date,
        rfd_rec."status" AS rfd_rec_status,
        w."id" AS w_id,
        dd."validityStart" as validity_start,
        dd."validityEnd" as validity_end,
        dd."months_period_level_2" as months_period_level_2,
        dd."months_period_level_3" as months_period_level_3,
        dd."months_period_level_4" as months_period_level_4,
        dd."months_period_level_5" as months_period_level_5,
        risk."name" AS risk_name,
        risk."type" AS risk_type,
        hg."type" AS hg_type,
        hg."name" AS hg_name,
        cc."name" AS cc_name,
        cc."type" AS cc_type,
        (array_agg(h."type"))[1] AS h_type,
        (array_agg(h."name"))[1] AS h_name,
        (array_agg(CASE WHEN hg."type" = 'HIERARCHY' THEN h."name" WHEN cc."name" IS NOT NULL THEN cc."name" ELSE hg."name" END))[1] AS origin,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', hierarchies."name", 'type', hierarchies.type)) 
          FILTER (WHERE hierarchies."name" IS NOT NULL), '[]'
        ) AS hierarchies,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', gs."name")) 
          FILTER (WHERE gs."name" IS NOT NULL), '[]'
        ) AS generateSources
      FROM 
        "RiskFactorData" rfd
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
        "HomogeneousGroup" hg ON hg."id" = rfd."homogeneousGroupId"
      LEFT JOIN
        "HierarchyOnHomogeneous" hh ON hh."homogeneousGroupId" = hg."id" AND hh."endDate" IS NULL
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
      LEFT JOIN
        "CompanyCharacterization" cc ON cc."id" = hg."id"
      LEFT JOIN
        "Workspace" w ON w."companyId" = rfd."companyId"
      LEFT JOIN
        "DocumentData" dd ON dd."workspaceId" = w."id"
      LEFT JOIN LATERAL (
        SELECT h_all."name", h_all."type"
        FROM "Hierarchy" h_all
        WHERE h_all."id" IN (h."id", h_parent_1."id", h_parent_2."id", h_parent_3."id", h_parent_4."id", h_children_1."id", h_children_2."id", h_children_3."id", h_children_4."id", h_children_5."id")
      ) AS hierarchies ON true
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        rec."id",
        rfd."id",
        rfd."createdAt",
        rfd."level",
        rec."recName",
        rfd_rec."updated_at",
        rfd_rec."startDate",
        rfd_rec."doneDate",
        rfd_rec."canceledDate",
        rfd_rec."endDate",
        rfd_rec."status",
        w."id",
        dd."validityStart", 
        dd."validityEnd",
        dd."months_period_level_2",
        dd."months_period_level_3",
        dd."months_period_level_4",
        dd."months_period_level_5",
        risk."name",
        risk."type",
        hg."type",
        hg."name",
        cc."name",
        cc."type"
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${1000}
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

    // return ActionPlanBrowseModelMapper.toModel({
    //   results: actionplans,
    //   pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalActionPlans[0].total) },
    //   filters: distinctFilters[0],
    // })
  }

  private browseWhere(filters: IActionPlanDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`rfd."companyId" = ${filters.companyId}`,
      Prisma.sql`rfd."endDate" IS NULL`,
      Prisma.sql`rfd."deletedAt" IS NULL`,
      Prisma.sql`w."id" IS NOT NULL`,
    ]

    return where
  }

  private filterWhere(filters: IActionPlanDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = []

    if (filters.search) {
      const search = `%${filters.search}%`
      where.push(Prisma.sql`unaccent(lower(hg.name)) ILIKE unaccent(lower(${search}))`)
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

    //missing / hierarchy type / origin type / generateSource

    const map: Record<ActionPlanOrderByEnum, string> = {
      [ActionPlanOrderByEnum.UPDATED_AT]: 'rfd_rec_updated_at',
      [ActionPlanOrderByEnum.CREATED_AT]: 'rfd_created_at',
      [ActionPlanOrderByEnum.ORIGIN]: 'origin',
      [ActionPlanOrderByEnum.ORIGIN_TYPE]: 'hg_type',
      [ActionPlanOrderByEnum.CANCEL_DATE]: 'rfd_rec_canceled_date',
      [ActionPlanOrderByEnum.DONE_DATE]: 'rfd_rec_done_date',
      [ActionPlanOrderByEnum.START_DATE]: 'rfd_rec_start_date',
      [ActionPlanOrderByEnum.LEVEL]: 'rfd_level',
      [ActionPlanOrderByEnum.RISK]: 'risk_name',
      [ActionPlanOrderByEnum.RECOMMENDATION]: 'rec_name',
      [ActionPlanOrderByEnum.STATUS]: 'rfd_rec_status',

      [ActionPlanOrderByEnum.VALID_DATE]: `
        CASE 
          WHEN rfd_rec."endDate" IS NOT NULL THEN rfd_rec."endDate" 
          WHEN dd."validityStart" IS NULL THEN NULL::timestamp 
          WHEN rfd."level" = 2 AND dd.months_period_level_2 IS NOT NULL THEN dd."validityStart" + dd.months_period_level_2 * INTERVAL '1 month' 
          WHEN rfd."level" = 3 AND dd.months_period_level_3 IS NOT NULL THEN dd."validityStart" + dd.months_period_level_3 * INTERVAL '1 month' 
          WHEN rfd."level" = 4 AND dd.months_period_level_4 IS NOT NULL THEN dd."validityStart" + dd.months_period_level_4 * INTERVAL '1 month' 
          WHEN rfd."level" = 5 AND dd.months_period_level_5 IS NOT NULL THEN dd."validityStart" + dd.months_period_level_5 * INTERVAL '1 month' 
          ELSE NULL::timestamp 
        END`,
    }



    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }))

    return orderByRaw
  }
}
