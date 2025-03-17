import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { gerHavingRawPrisma } from '@/@v2/shared/utils/database/get-having-raw-prisma';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IActionPlanBrowseFilterModelMapper } from '../../mappers/models/action-plan/action-plan-browse-filter.mapper';
import { IActionPlanBrowseResultModelMapper } from '../../mappers/models/action-plan/action-plan-browse-result.mapper';
import { ActionPlanBrowseModelMapper } from '../../mappers/models/action-plan/action-plan-browse.mapper';
import { ActionPlanOrderByEnum, IActionPlanDAO } from './action-plan.types';
import { ActionPlanStatusEnum } from '../../../domain/enums/action-plan-status.enum';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { ActionPlanReadMapper } from '../../mappers/models/action-plan/action-plan-read.mapper';

@Injectable()
export class ActionPlanDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async find(params: IActionPlanDAO.FindParams) {
    const homogeneousGroupPromise = this.prisma.homogeneousGroup.findFirst({
      where: {
        riskFactorData: {
          some: { id: params.riskDataId },
        },
        companyId: params.companyId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        companyId: true,
        riskFactorData: {
          where: {
            id: params.riskDataId,
          },
          select: {
            recs: {
              select: {
                recName: true,
              },
              where: {
                id: params.recommendationId,
              },
            },
          },
        },
        hierarchyOnHomogeneous: {
          select: {
            hierarchy: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
        characterization: {
          select: {
            name: true,
            type: true,
            photos: true,
          },
        },
      },
    });

    const photosPromise = this.prisma.riskFactorDataRecPhoto.findMany({
      where: {
        deleted_at: null,
        risk_data_rec: {
          workspaceId: params.workspaceId,
          companyId: params.companyId,
          recMedId: params.recommendationId,
          riskFactorDataId: params.riskDataId,
        },
      },
      include: {
        file: true,
      },
    });

    const [homogeneousGroup, photos] = await Promise.all([homogeneousGroupPromise, photosPromise]);

    return homogeneousGroup ? ActionPlanReadMapper.toModel({ homogeneousGroup, photos, params }) : null;
  }

  async browse({ limit, page, orderBy, filters }: IActionPlanDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const { filterHaving, filterWhere } = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhere];
    const whereTotalParams = [...whereParams, ...filterHaving];

    const actionPlansPromise = this.prisma.$queryRaw<IActionPlanBrowseResultModelMapper[]>`
      WITH "DocumentDataUnique" AS (
        SELECT DISTINCT ON ("workspaceId") *
        FROM "DocumentData" dd
        WHERE dd."type" = 'PGR'
      )
      SELECT 
        rec."id" AS rec_id,
        rec."recName" AS rec_name,
        rec."recType" AS rec_type,
        rfd."id" AS rfd_id,
        rfd."createdAt" AS rfd_created_at, 
        rfd."level" AS rfd_level,
        rfd_rec."id" AS rfd_rec_id,
        rfd_rec."updated_at" AS rfd_rec_updated_at,
        rfd_rec."startDate" AS rfd_rec_start_date,
        rfd_rec."doneDate" AS rfd_rec_done_date,
        rfd_rec."canceledDate" AS rfd_rec_canceled_date,
        rfd_rec."endDate" AS rfd_rec_end_date,
        rfd_rec."status" AS rfd_rec_status,
        rec_to_rfd."sequential_id" AS rec_to_rfd_sequential_id,
        w."id" AS w_id,
        w."name" AS w_name,
        dd."validityStart" as validity_start,
        dd."validityEnd" as validity_end,
        dd."months_period_level_2" as months_period_level_2,
        dd."months_period_level_3" as months_period_level_3,
        dd."months_period_level_4" as months_period_level_4,
        dd."months_period_level_5" as months_period_level_5,
        risk."id" AS risk_id,
        risk."name" AS risk_name,
        risk."type" AS risk_type,
        hg."type" AS hg_type,
        hg."id" AS hg_id,
        hg."name" AS hg_name,
        cc."id" AS cc_id,
        cc."name" AS cc_name,
        cc."type" AS cc_type,
        u_resp."id" AS resp_id,
        u_resp."name" AS resp_name,
        (array_agg(h."type"))[1] AS h_type,
        (array_agg(h."name"))[1] AS h_name,
        (array_agg(
          CASE 
            WHEN hg."type" = 'HIERARCHY' THEN h."name" 
            WHEN cc."name" IS NOT NULL THEN cc."name" 
            ELSE hg."name" 
          END
        ))[1] AS origin,
        (array_agg(
          CASE 
            WHEN rfd_rec."endDate" IS NOT NULL THEN rfd_rec."endDate" 
            WHEN dd."validityStart" IS NULL THEN NULL::timestamp 
            WHEN rfd."level" = 2 THEN dd."validityStart" + dd.months_period_level_2 * INTERVAL '1 month' 
            WHEN rfd."level" = 3 THEN dd."validityStart" + dd.months_period_level_3 * INTERVAL '1 month' 
            WHEN rfd."level" = 4 THEN dd."validityStart" + dd.months_period_level_4 * INTERVAL '1 month' 
            WHEN rfd."level" = 5 THEN dd."validityStart" + dd.months_period_level_5 * INTERVAL '1 month' 
            WHEN rfd."level" = 6 THEN dd."validityStart"
            ELSE NULL::timestamp 
          END
        ))[1] AS valid_date,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', gs."name", 'id', gs."id")) 
          FILTER (WHERE gs."name" IS NOT NULL), '[]'
        ) AS generateSources,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', comment."id"
            ,'text', comment."text" 
            ,'type', comment."type" 
            ,'text_type', comment."textType"
            ,'approved_comment', comment."approvedComment"
            ,'is_approved', comment."isApproved"
            ,'created_at', comment."created_at"
          )) 
          FILTER (WHERE comment."id" IS NOT NULL), '[]'
        ) AS comments
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
        "RiskFactorDataRec" rfd_rec ON rfd_rec."riskFactorDataId" = rfd."id" AND rfd_rec."recMedId" = rec."id"
      LEFT JOIN 
        "RiskFactorDataRecComments" comment ON comment."riskFactorDataRecId" = rfd_rec."id"
      LEFT JOIN 
        "User" u_resp ON u_resp."id" = rfd_rec."responsibleId"
      LEFT JOIN
        "HomogeneousGroup" hg ON hg."id" = rfd."homogeneousGroupId"
      ${
        filters.workspaceIds?.length
          ? Prisma.sql`
        LEFT JOIN
            "_HomogeneousGroupToWorkspace" hg_to_w ON hg_to_w."A" = hg."id"
      `
          : Prisma.sql``
      }
      LEFT JOIN
        "HierarchyOnHomogeneous" hh ON hh."homogeneousGroupId" = hg."id" AND hh."endDate" IS NULL
      LEFT JOIN 
        "Hierarchy" h ON h."id" = hh."hierarchyId"
      ${
        filters.hierarchyIds?.length
          ? Prisma.sql`
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
      `
          : Prisma.sql``
      }
      LEFT JOIN
        "CompanyCharacterization" cc ON cc."id" = hg."id"
      LEFT JOIN
        "Workspace" w ON w."companyId" = rfd."companyId"
      LEFT JOIN
        "DocumentDataUnique" dd ON dd."workspaceId" = w."id"
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        rec."id",
        rfd."id",
        rfd."createdAt",
        rfd."level",
        rec."recName",
        rfd_rec."id",
        rfd_rec."updated_at",
        rfd_rec."startDate",
        rfd_rec."doneDate",
        rfd_rec."canceledDate",
        rfd_rec."endDate",
        rfd_rec."status",
        rec_to_rfd."sequential_id",
        w."id",
        w."name",
        dd."validityStart", 
        dd."validityEnd",
        dd."months_period_level_2",
        dd."months_period_level_3",
        dd."months_period_level_4",
        dd."months_period_level_5",
        risk."id",
        risk."name",
        risk."type",
        hg."id",
        hg."type",
        hg."name",
        cc."id",
        cc."name",
        cc."type",
        u_resp."id",
        u_resp."name"
      ${gerHavingRawPrisma(filterHaving)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalActionPlansPromise = this.prisma.$queryRaw<[{ total: number } & IActionPlanBrowseFilterModelMapper]>`
      SELECT 
        COUNT(DISTINCT (rfd."id", rec."id"))::integer AS total,
        array_agg(DISTINCT CASE WHEN rfd_rec."status" is NULL THEN 'PENDING' ELSE rfd_rec."status"::TEXT END) AS filter_status,
        json_agg(DISTINCT JSONB_BUILD_OBJECT('id', w.id, 'name', w.name)) AS workspaces
      FROM 
        "RiskFactorData" rfd
      JOIN 
        "_recs" rec_to_rfd ON rec_to_rfd."B" = rfd."id"
      LEFT JOIN
        "RecMed" rec ON rec."id" = rec_to_rfd."A"
      ${
        filters.riskIds?.length
          ? Prisma.sql`
        LEFT JOIN "RiskFactors" risk ON risk."id" = rfd."riskId"
      `
          : Prisma.sql``
      }
      ${
        filters.generateSourceIds?.length
          ? Prisma.sql`
        LEFT JOIN
          "_GenerateSourceToRiskFactorData" gs_to_rfd ON gs_to_rfd."B" = rfd."id"
        LEFT JOIN
          "GenerateSource" gs ON gs."id" = gs_to_rfd."A"
      `
          : Prisma.sql``
      }
      LEFT JOIN 
        "RiskFactorDataRec" rfd_rec ON rfd_rec."riskFactorDataId" = rfd."id" AND rfd_rec."recMedId" = rec."id"
      ${
        filters.responisbleIds?.length
          ? Prisma.sql`
        LEFT JOIN  "User" u_resp ON u_resp."id" = rfd_rec."responsibleId"
      `
          : Prisma.sql``
      }
      LEFT JOIN
        "HomogeneousGroup" hg ON hg."id" = rfd."homogeneousGroupId"
      ${
        filters.workspaceIds?.length
          ? Prisma.sql`
        LEFT JOIN
            "_HomogeneousGroupToWorkspace" hg_to_w ON hg_to_w."A" = hg."id"
      `
          : Prisma.sql``
      }
      LEFT JOIN
        "HierarchyOnHomogeneous" hh ON hh."homogeneousGroupId" = hg."id" AND hh."endDate" IS NULL
      LEFT JOIN 
        "Hierarchy" h ON h."id" = hh."hierarchyId"
      ${
        filters.hierarchyIds?.length
          ? Prisma.sql`
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
      `
          : Prisma.sql``
      }
      LEFT JOIN
        "CompanyCharacterization" cc ON cc."id" = hg."id"
      LEFT JOIN
        "Workspace" w ON w."companyId" = rfd."companyId"
      LEFT JOIN
        "DocumentData" dd ON dd."workspaceId" = w."id"
      ${gerWhereRawPrisma(whereTotalParams)}
    `;

    const [actionPlans, totalActionPlans] = await Promise.all([actionPlansPromise, totalActionPlansPromise]);

    return ActionPlanBrowseModelMapper.toModel({
      results: actionPlans,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalActionPlans[0].total) },
      filters: totalActionPlans[0],
    });
  }

  private browseWhere(filters: IActionPlanDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`rfd."companyId" = ${filters.companyId}`, Prisma.sql`rfd."endDate" IS NULL`, Prisma.sql`rfd."deletedAt" IS NULL`, Prisma.sql`w."id" IS NOT NULL`];

    return where;
  }

  private filterWhere(filters: IActionPlanDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];
    const having: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      const searchOrigin = Prisma.sql`(
        unaccent(lower(
          CASE 
            WHEN hg."type" = 'HIERARCHY' THEN h."name" 
            WHEN cc."name" IS NOT NULL THEN cc."name" 
            ELSE hg."name"
          END
        )) ILIKE unaccent(lower(${search}))
      )`;

      const searchSequence = Prisma.sql`(
        rec_to_rfd."sequential_id" = CAST(${filters.search} AS INTEGER)
      )`;

      where.push(gerWhereRawPrisma([searchOrigin, searchSequence], { type: 'OR', removeWhereStatement: true }));
    }

    if (filters.workspaceIds?.length) {
      where.push(Prisma.sql`w."id" IN (${Prisma.join(filters.workspaceIds)})`);
      where.push(Prisma.sql`hg_to_w."B" IN (${Prisma.join(filters.workspaceIds)})`);
    }

    if (filters.generateSourceIds?.length) {
      where.push(Prisma.sql`gs."id" IN (${Prisma.join(filters.generateSourceIds)})`);
    }

    if (filters.responisbleIds?.length) {
      const includeNull = filters.responisbleIds.includes(0);

      if (includeNull) {
        if (filters.responisbleIds.length === 1) where.push(Prisma.sql`u_resp."id" IS NULL`);
        else where.push(Prisma.sql`u_resp."id" IN (${Prisma.join(filters.responisbleIds.filter(Boolean))}) OR u_resp."id" IS NULL`);
      }

      if (!includeNull) {
        where.push(Prisma.sql`u_resp."id" IN (${Prisma.join(filters.responisbleIds)})`);
      }
    }

    if (filters.recommendationIds?.length) {
      where.push(Prisma.sql`rec."id" IN (${Prisma.join(filters.recommendationIds)})`);
    }

    if (filters.riskIds?.length) {
      where.push(Prisma.sql`risk."id" IN (${Prisma.join(filters.riskIds)})`);
    }

    if (filters.recommendationIds?.length) {
      where.push(Prisma.sql`rec."id" IN (${Prisma.join(filters.recommendationIds)})`);
    }

    if (filters.ocupationalRisks?.length) {
      where.push(Prisma.sql`rfd."level" IN (${Prisma.join(filters.ocupationalRisks)})`);
    }
    if (filters.status?.length) {
      where.push(Prisma.sql`
        CASE 
          WHEN rfd_rec."status" IS NULL THEN 'PENDING'
          ELSE rfd_rec."status"::TEXT
        END
        IN (${Prisma.join(filters.status)})
      `);
    }

    if (typeof filters.isCanceled === 'boolean') {
      where.push(Prisma.sql`rfd_rec."canceledDate" ${filters.isCanceled ? Prisma.sql`IS NOT` : Prisma.sql`IS`} NULL`);
    }

    if (typeof filters.isDone === 'boolean') {
      where.push(Prisma.sql`rfd_rec."doneDate" ${filters.isDone ? Prisma.sql`IS NOT` : Prisma.sql`IS`} NULL`);
    }

    if (typeof filters.isStarted === 'boolean') {
      where.push(Prisma.sql`rfd_rec."startDate" ${filters.isStarted ? Prisma.sql`IS NOT` : Prisma.sql`IS`} NULL`);
    }

    if (typeof filters.isExpired === 'boolean') {
      having.push(Prisma.sql` 
        CASE 
          WHEN rfd_rec."endDate" IS NOT NULL THEN rfd_rec."endDate" 
          WHEN dd."validityStart" IS NULL THEN NULL::timestamp 
          WHEN rfd."level" = 2 THEN dd."validityStart" + dd.months_period_level_2 * INTERVAL '1 month' 
          WHEN rfd."level" = 3 THEN dd."validityStart" + dd.months_period_level_3 * INTERVAL '1 month' 
          WHEN rfd."level" = 4 THEN dd."validityStart" + dd.months_period_level_4 * INTERVAL '1 month' 
          WHEN rfd."level" = 5 THEN dd."validityStart" + dd.months_period_level_5 * INTERVAL '1 month' 
          WHEN rfd."level" = 6 THEN dd."validityStart"
          ELSE NULL::timestamp 
        END 
        ${filters.isExpired ? Prisma.sql`<=` : Prisma.sql`>`} NOW()`);
    }

    if (filters.hierarchyIds?.length) {
      where.push(Prisma.sql`
          h."id" IN (${Prisma.join(filters.hierarchyIds)}) OR 
          h_parent_1."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_parent_2."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_parent_3."id" IN (${Prisma.join(filters.hierarchyIds)}) OR 
          h_parent_4."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_parent_5."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_children_1."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_children_2."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_children_3."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_children_4."id" IN (${Prisma.join(filters.hierarchyIds)}) OR
          h_children_5."id" IN (${Prisma.join(filters.hierarchyIds)})
        `);
    }

    return { filterWhere: where, filterHaving: having };
  }

  private browseOrderBy(orderBy: IActionPlanDAO.BrowseParams['orderBy'] = []) {
    const desiredOrder = [ActionPlanStatusEnum.REJECTED, ActionPlanStatusEnum.PROGRESS, ActionPlanStatusEnum.PENDING, ActionPlanStatusEnum.DONE, ActionPlanStatusEnum.CANCELED];

    const map: Record<ActionPlanOrderByEnum, string> = {
      [ActionPlanOrderByEnum.UPDATED_AT]: 'rfd_rec_updated_at',
      [ActionPlanOrderByEnum.CREATED_AT]: 'rfd_created_at',
      [ActionPlanOrderByEnum.ORIGIN_TYPE]: 'hg_type',
      [ActionPlanOrderByEnum.CANCEL_DATE]: 'rfd_rec_canceled_date',
      [ActionPlanOrderByEnum.DONE_DATE]: 'rfd_rec_done_date',
      [ActionPlanOrderByEnum.START_DATE]: 'rfd_rec_start_date',
      [ActionPlanOrderByEnum.RISK]: 'risk_name',
      [ActionPlanOrderByEnum.RECOMMENDATION]: 'rec_name',
      [ActionPlanOrderByEnum.RESPONSIBLE]: 'resp_name',
      [ActionPlanOrderByEnum.STATUS]: `
        CASE rfd_rec.status 
          ${desiredOrder.map((type, index) => `WHEN '${type}' THEN ${index}`).join(' ')} 
          ELSE ${desiredOrder.findIndex((type) => type === ActionPlanStatusEnum.PENDING)} 
        END
      `,
      [ActionPlanOrderByEnum.ORIGIN]: 'origin',
      [ActionPlanOrderByEnum.VALID_DATE]: `valid_date`,
      [ActionPlanOrderByEnum.LEVEL]: `
        CASE
          WHEN rfd."level" IS NULL THEN 0
          ELSE rfd."level"
        END
      `,
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));
    orderByRaw.push({ column: 'rec_id', order: OrderByDirectionEnum.ASC });
    orderByRaw.push({ column: 'rfd_rec_id', order: OrderByDirectionEnum.ASC });
    orderByRaw.push({ column: 'rfd_id', order: OrderByDirectionEnum.ASC });
    orderByRaw.push({ column: 'w_id', order: OrderByDirectionEnum.ASC });
    orderByRaw.push({ column: 'hg_id', order: OrderByDirectionEnum.ASC });
    orderByRaw.push({ column: 'cc_id', order: OrderByDirectionEnum.ASC });

    return orderByRaw;
  }
}
