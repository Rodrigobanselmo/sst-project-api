import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { gerHavingRawPrisma } from '@/@v2/shared/utils/database/get-having-raw-prisma';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ActionPlanStatusEnum } from '../../../domain/enums/action-plan-status.enum';
import { IActionPlanBrowseFilterModelMapper } from '../../mappers/models/action-plan/action-plan-browse-filter.mapper';
import { IActionPlanBrowseResultModelMapper } from '../../mappers/models/action-plan/action-plan-browse-result.mapper';
import { ActionPlanBrowseModelMapper } from '../../mappers/models/action-plan/action-plan-browse.mapper';
import { ActionPlanReadMapper } from '../../mappers/models/action-plan/action-plan-read.mapper';
import { ActionPlanOrderByEnum, IActionPlanDAO } from './action-plan.types';
import { ActionPlanNewTasksMapper, IActionPlanNewTasksMapper } from '../../mappers/models/action-plan/action-plan-new-tasks.mapper';
import { ActionPlanAllTasksMapper } from '../../mappers/models/action-plan/action-plan-all-tasks.mapper';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';

@Injectable()
export class ActionPlanDAO {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async findAllTasks() {
    const actionPlans = await this.prisma.$queryRaw<IActionPlanNewTasksMapper[]>`
      SELECT
        rf_data_rec."companyId" as company_id,
        rf_data_rec."responsibleId" as responsible_id,
        ARRAY_AGG(rf_data_rec."id") as ids
      FROM
        "RiskFactorDataRec" rf_data_rec
      JOIN
        "RecMedOnRiskData" rec_med_on_risk_data 
          ON rec_med_on_risk_data."risk_data_id" = rf_data_rec."riskFactorDataId" 
          AND rec_med_on_risk_data."rec_med_id" = rf_data_rec."recMedId"
      WHERE
        rf_data_rec."responsibleId" IS NOT NULL
        AND rf_data_rec."status"::text <> 'CANCELED'
        AND rf_data_rec."status"::text <> 'DONE'
      GROUP BY 
        rf_data_rec."companyId",
        rf_data_rec."responsibleId"
      LIMIT 500
      OFFSET 0
    `;

    return actionPlans ? ActionPlanAllTasksMapper.toModels(actionPlans) : null;
  }

  async findNewTasks() {
    const actionPlans = await this.prisma.$queryRaw<IActionPlanNewTasksMapper[]>`
      SELECT
        rf_data_rec."companyId" as company_id,
        rf_data_rec."responsibleId" as responsible_id,
        ARRAY_AGG(rf_data_rec."id") as ids
      FROM
        "RiskFactorDataRec" rf_data_rec
      JOIN
        "RecMedOnRiskData" rec_med_on_risk_data 
          ON rec_med_on_risk_data."risk_data_id" = rf_data_rec."riskFactorDataId" 
          AND rec_med_on_risk_data."rec_med_id" = rf_data_rec."recMedId"
      WHERE
        rf_data_rec."responsibleId" IS NOT NULL
        AND rf_data_rec."status"::text <> 'CANCELED'
        AND rf_data_rec."status"::text <> 'DONE'
        AND (
          rf_data_rec."responsible_updated_at" > rf_data_rec."responsible_notified_at" 
          OR rf_data_rec."responsible_notified_at" IS NULL
        )
      GROUP BY 
        rf_data_rec."companyId",
        rf_data_rec."responsibleId"
      LIMIT 300
      OFFSET 0
    `;

    return actionPlans ? ActionPlanNewTasksMapper.toModels(actionPlans) : null;
  }

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
                recMed: {
                  select: {
                    recName: true,
                  },
                },
              },
              where: {
                rec_med_id: params.recommendationId,
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
            photos: {
              include: {
                characterizationPhotoRecommendation: {
                  where: {
                    recommendation_id: params.recommendationId,
                    risk_data_id: params.riskDataId,
                  },
                },
              },
            },
          },
        },
      },
    });

    const actionPlanPromise = this.prisma.riskFactorDataRec.findFirst({
      where: {
        recMedId: params.recommendationId,
        riskFactorDataId: params.riskDataId,
        workspaceId: params.workspaceId,
        companyId: params.companyId,
      },
      select: {
        id: true,
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

    const generateSourcesPromise = this.prisma.riskFactorData.findFirst({
      where: {
        id: params.riskDataId,
        companyId: params.companyId,
      },
      select: {
        generateSources: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const [homogeneousGroup, photos, actionPlan, generateSourcesData] = await Promise.all([homogeneousGroupPromise, photosPromise, actionPlanPromise, generateSourcesPromise]);

    return homogeneousGroup ? ActionPlanReadMapper.toModel({ homogeneousGroup, photos, actionPlan, generateSources: generateSourcesData?.generateSources || [], params }) : null;
  }

  async browse({ limit, page, orderBy, filters }: IActionPlanDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const { filterHaving, filterWhere } = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhere];
    const whereTotalParams = [...whereParams, ...filterHaving];

    const includeHierarchies = Array.isArray(filters.rules?.hierarchyAccess?.value) || !!filters.hierarchyIds?.length;
    const includeRiskSubType = Array.isArray(filters.rules?.riskSubTypeAccess?.value) || !!filters.riskSubTypes?.length;
    const includeResponsible = filters.responsibleIds?.length || filters.rules.hasAnyRule;
    const includeRisk = filters.riskIds?.length || includeRiskSubType || !!filters.riskTypes?.length;

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
            'id', risk_sub_type_table."id",
            'name', risk_sub_type_table."name"
          )) FILTER (WHERE risk_sub_type_table."id" IS NOT NULL), '[]'
        ) AS risk_sub_types,
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
        "RecMedOnRiskData" rec_to_rfd ON rec_to_rfd."risk_data_id" = rfd."id"
      LEFT JOIN
        "RecMed" rec ON rec."id" = rec_to_rfd."rec_med_id"
      LEFT JOIN
        "RiskFactors" risk ON risk."id" = rfd."riskId"
      LEFT JOIN 
        "RiskToRiskSubType" risk_sub_type ON risk_sub_type."risk_id" = risk."id"
      LEFT JOIN
        "RiskSubType" risk_sub_type_table ON risk_sub_type_table."id" = risk_sub_type."sub_type_id"
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
        includeResponsible
          ? Prisma.sql`
            LEFT JOIN "Task" task ON task."action_plan_id" = rfd_rec."id"
            LEFT JOIN "TaskResponsible" task_resp ON task_resp."task_id" = task."id"
          `
          : Prisma.sql``
      }
      ${
        filters.workspaceIds?.length
          ? Prisma.sql`
              LEFT JOIN "_HomogeneousGroupToWorkspace" hg_to_w ON hg_to_w."A" = hg."id"
            `
          : Prisma.sql``
      }
      LEFT JOIN
        "HierarchyOnHomogeneous" hh ON hh."homogeneousGroupId" = hg."id" AND hh."endDate" IS NULL
      LEFT JOIN 
        "Hierarchy" h ON h."id" = hh."hierarchyId"
      ${
        includeHierarchies
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
        json_agg(DISTINCT JSONB_BUILD_OBJECT('id', w.id, 'name', w.name)) AS workspaces,
        array_agg(DISTINCT risk."type") AS filter_risk_types,
        json_agg(DISTINCT JSONB_BUILD_OBJECT('id', risk_sub_type_table."id", 'name', risk_sub_type_table."name", 'type' ,risk_sub_type_table."type")) AS filter_risk_sub_types
      FROM 
        "RiskFactorData" rfd
      JOIN 
        "RecMedOnRiskData" rec_to_rfd ON rec_to_rfd."risk_data_id" = rfd."id"
      LEFT JOIN
        "RecMed" rec ON rec."id" = rec_to_rfd."rec_med_id"
      LEFT JOIN 
        "RiskFactors" risk ON risk."id" = rfd."riskId"
      LEFT JOIN
        "RiskToRiskSubType" risk_sub_type ON risk_sub_type."risk_id" = risk."id"
      LEFT JOIN
        "RiskSubType" risk_sub_type_table ON risk_sub_type_table."id" = risk_sub_type."sub_type_id"
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
        includeResponsible
          ? Prisma.sql`
        LEFT JOIN  "User" u_resp ON u_resp."id" = rfd_rec."responsibleId"
      `
          : Prisma.sql``
      }
      ${
        includeResponsible
          ? Prisma.sql`
            LEFT JOIN "Task" task ON task."action_plan_id" = rfd_rec."id"
            LEFT JOIN "TaskResponsible" task_resp ON task_resp."task_id" = task."id"
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
        includeHierarchies
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
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const where: Prisma.Sql[] = [];
    const whereOR: Prisma.Sql[] = [];
    const having: Prisma.Sql[] = [];

    if (filters.search) {
      const whereSearch: Prisma.Sql[] = [];
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

      if (!isNaN(Number(filters.search))) {
        const searchSequence = Prisma.sql`(
        rec_to_rfd."sequential_id" = CAST(${filters.search} AS INTEGER)
      )`;

        whereSearch.push(searchSequence);
      }

      whereSearch.push(searchOrigin);
      where.push(gerWhereRawPrisma(whereSearch, { type: 'OR', removeWhereStatement: true }));
    }

    if (filters.workspaceIds?.length) {
      where.push(Prisma.sql`w."id" IN (${Prisma.join(filters.workspaceIds)})`);
      where.push(Prisma.sql`hg_to_w."B" IN (${Prisma.join(filters.workspaceIds)})`);
    }

    if (filters.generateSourceIds?.length) {
      where.push(Prisma.sql`gs."id" IN (${Prisma.join(filters.generateSourceIds)})`);
    }

    if (filters.responsibleIds?.length) {
      const includeNull = filters.responsibleIds.includes(0);

      if (includeNull) {
        if (filters.responsibleIds.length === 1) where.push(Prisma.sql`u_resp."id" IS NULL`);
        else
          where.push(
            Prisma.sql`u_resp."id" IN (${Prisma.join(filters.responsibleIds.filter(Boolean))}) OR u_resp."id" IS NULL OR task_resp."user_id" IN (${Prisma.join(filters.responsibleIds.filter(Boolean))})`,
          );
      }

      if (!includeNull) {
        where.push(Prisma.sql`
          u_resp."id" IN (${Prisma.join(filters.responsibleIds)}) 
          OR task_resp."user_id" IN (${Prisma.join(filters.responsibleIds.filter(Boolean))})
        `);
      }
    }

    if (filters.recommendationIds?.length) {
      where.push(Prisma.sql`rec."id" IN (${Prisma.join(filters.recommendationIds)})`);
    }

    if (filters.recommendationIds?.length) {
      where.push(Prisma.sql`rec."id" IN (${Prisma.join(filters.recommendationIds)})`);
    }

    if (filters.occupationalRisks?.length) {
      where.push(Prisma.sql`rfd."level" IN (${Prisma.join(filters.occupationalRisks)})`);
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

    if (filters.riskIds?.length) {
      where.push(Prisma.sql`risk."id" IN (${Prisma.join(filters.riskIds)})`);
    }

    if (filters.riskTypes?.length) {
      where.push(Prisma.sql`risk."type"::text IN (${Prisma.join(filters.riskTypes)})`);
    }

    if (filters.riskSubTypes?.length) {
      where.push(Prisma.sql`risk_sub_type."sub_type_id" IN (${Prisma.join(filters.riskSubTypes)})`);
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

    if (filters.rules) {
      const whereRules: Prisma.Sql[] = [];

      if (filters.rules.hierarchyAccess) {
        const { type, value } = filters.rules.hierarchyAccess;
        if (type === 'restrict') {
          if (value === 'all') {
            whereRules.push(Prisma.sql`hg."id" = '-'`);
          } else if (value.length > 0) {
            whereRules.push(Prisma.sql`
              h."id" NOT IN (${Prisma.join(value)}) OR 
              h_parent_1."id" NOT IN (${Prisma.join(value)}) OR
              h_parent_2."id" NOT IN (${Prisma.join(value)}) OR
              h_parent_3."id" NOT IN (${Prisma.join(value)}) OR 
              h_parent_4."id" NOT IN (${Prisma.join(value)}) OR
              h_parent_5."id" NOT IN (${Prisma.join(value)}) OR
              h_children_1."id" NOT IN (${Prisma.join(value)}) OR
              h_children_2."id" NOT IN (${Prisma.join(value)}) OR
              h_children_3."id" NOT IN (${Prisma.join(value)}) OR
              h_children_4."id" NOT IN (${Prisma.join(value)}) OR
              h_children_5."id" NOT IN (${Prisma.join(value)})
            `);
          }
        }

        if (type === 'allow') {
          if (value === 'all') {
            // do nothing, as 'all' means no restriction
          } else if (value.length > 0) {
            whereRules.push(Prisma.sql`
              h."id" IN (${Prisma.join(value)}) OR 
              h_parent_1."id" IN (${Prisma.join(value)}) OR
              h_parent_2."id" IN (${Prisma.join(value)}) OR
              h_parent_3."id" IN (${Prisma.join(value)}) OR 
              h_parent_4."id" IN (${Prisma.join(value)}) OR
              h_parent_5."id" IN (${Prisma.join(value)}) OR
              h_children_1."id" IN (${Prisma.join(value)}) OR
              h_children_2."id" IN (${Prisma.join(value)}) OR
              h_children_3."id" IN (${Prisma.join(value)}) OR
              h_children_4."id" IN (${Prisma.join(value)}) OR
              h_children_5."id" IN (${Prisma.join(value)})
            `);
          }
        }
      }

      if (filters.rules.riskTypeAccess) {
        const { type, value } = filters.rules.riskTypeAccess;
        if (type === 'restrict') {
          if (value === 'all') {
            whereRules.push(Prisma.sql`risk."id" = '-'`);
          } else if (value.length > 0) {
            whereRules.push(Prisma.sql`risk."type"::text NOT IN (${Prisma.join(value)})`);
          }
        }

        if (type === 'allow') {
          if (value === 'all') {
            // do nothing, as 'all' means no restriction
          } else if (value.length > 0) {
            whereRules.push(Prisma.sql`risk."type"::text IN (${Prisma.join(value)})`);
          }
        }
      }

      if (filters.rules.riskSubTypeAccess) {
        const { type, value } = filters.rules.riskSubTypeAccess;
        if (type === 'restrict') {
          if (value === 'all') {
            whereRules.push(Prisma.sql`risk."id" = '-'`);
          } else if (value.length > 0) {
            whereRules.push(Prisma.sql`risk_sub_type."sub_type_id" NOT IN (${Prisma.join(value)}) OR risk_sub_type."sub_type_id" IS NULL`);
          }
        }

        if (type === 'allow') {
          if (value === 'all') {
            // do nothing, as 'all' means no restriction
          } else if (value.length > 0) {
            whereRules.push(Prisma.sql`risk_sub_type."sub_type_id" IN (${Prisma.join(value)}) OR risk_sub_type."sub_type_id" IS NULL`);
          }
        }
      }

      if (whereRules.length > 0) {
        whereOR.push(Prisma.sql`(${Prisma.join(whereRules, ' AND ')})`);

        whereOR.push(Prisma.sql`
          u_resp."id" IN (${Prisma.join([loggedUser.id])}) 
          OR task_resp."user_id" IN (${Prisma.join([loggedUser.id])})
      `);
      }
    }

    if (whereOR.length) {
      where.push(Prisma.sql`(${Prisma.join(whereOR, ' OR ')})`);
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
