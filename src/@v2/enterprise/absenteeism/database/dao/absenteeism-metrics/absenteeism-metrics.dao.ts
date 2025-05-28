import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerRawPrisma } from '@/@v2/shared/utils/database/get-raw-prisma';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { HierarchyEnum, Prisma } from '@prisma/client';
import { AbsenteeismHierarchyTypeEnum } from '../../../domain/enums/absenteeism-hierarchy-type';
import { gerRageDate } from '../../../domain/functions/get-rage-date';
import { IAbsenteeismDaysCountResultReadModelMapper } from '../../mappers/models/absenteeism-days-count/absenteeism-days-count-result.mapper';
import { AbsenteeismDaysCountReadModelMapper } from '../../mappers/models/absenteeism-days-count/absenteeism-days-count.mapper';
import { IAbsenteeismMotiveCountResultReadModelMapper } from '../../mappers/models/absenteeism-motive-count/absenteeism-motive-count-result.mapper';
import { AbsenteeismMotiveCountReadModelMapper } from '../../mappers/models/absenteeism-motive-count/absenteeism-motive-count.mapper';
import { IAbsenteeismTimelineTotalResultReadModelMapper } from '../../mappers/models/absenteeism-timeline-total/absenteeism-timeline-total-result.mapper';
import { AbsenteeismTimelineTotalReadModelMapper } from '../../mappers/models/absenteeism-timeline-total/absenteeism-timeline-total.mapper';
import { IAbsenteeismTotalEmployeeResultBrowseModelMapper } from '../../mappers/models/absenteeism-total-employee/absenteeism-total-employee-browse-result.mapper';
import { AbsenteeismTotalEmployeeBrowseModelMapper } from '../../mappers/models/absenteeism-total-employee/absenteeism-total-employee-browse.mapper';
import { IAbsenteeismTotalHierarchyResultBrowseModelMapper } from '../../mappers/models/absenteeism-total-hierarchy/absenteeism-total-hierarchy-browse-result.mapper';
import { AbsenteeismTotalHierarchyBrowseModelMapper } from '../../mappers/models/absenteeism-total-hierarchy/absenteeism-total-hierarchy-browse.mapper';
import { AbsenteeismEmployeeTotalOrderByEnum, AbsenteeismHierarchyTotalOrderByEnum, IAbsenteeismMetricsDAO } from './absenteeism-metrics.types';

@Injectable()
export class AbsenteeismMetricsDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async readTimelineTotal(filters: IAbsenteeismMetricsDAO.ReadTimelineCountParams) {
    const browseWhereParams = this.browseWhere(filters, { addYear: 1 });
    const filterWhereParams = this.filterWhere(filters);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const AbsenteeismMetrics = await this.prisma.$queryRaw<IAbsenteeismTimelineTotalResultReadModelMapper[]>`
      SELECT
        TO_CHAR(a."startDate", 'YYYY-MM') AS absenteeism_year_month,
        COUNT(a.id) AS total_absenteeism_count,
        SUM(ABS(a."timeSpent")) AS total_absenteeism_minutes
      FROM
        "Absenteeism" a
      JOIN
        "Employee" e ON a."employeeId" = e.id AND e."deleted_at" IS null AND e."companyId" = ${filters.companyId}
      ${
        filters.hierarchiesIds?.length || filters.workspacesIds?.length
          ? Prisma.sql`
            JOIN
              "EmployeeHierarchyHistory" ehh ON e.id = ehh."employeeId"
            JOIN
              "Hierarchy" h ON ehh."hierarchyId" = h.id AND h."deletedAt" IS null
            LEFT JOIN 
              "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId"
            LEFT JOIN 
              "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
            LEFT JOIN 
              "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
            LEFT JOIN 
              "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
            JOIN
              "_HierarchyToWorkspace" htw ON h.id = htw."A"
            JOIN
              "Workspace" w ON htw."B" = w.id 
          `
          : Prisma.sql``
      }
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY
        TO_CHAR(a."startDate", 'YYYY-MM')
      ORDER BY
        absenteeism_year_month;
    `;

    return AbsenteeismTimelineTotalReadModelMapper.toModel({
      results: AbsenteeismMetrics,
      range: gerRageDate(filters, { addYear: 1 }),
    });
  }

  async readDaysCount(filters: IAbsenteeismMetricsDAO.ReadDaysCountParams) {
    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const AbsenteeismMetrics = await this.prisma.$queryRaw<IAbsenteeismDaysCountResultReadModelMapper[]>`
      WITH DurationCategories AS (
        SELECT '0-1' AS category_name, 1 AS sort_order
        UNION ALL
        SELECT '1-4' AS category_name, 2 AS sort_order
        UNION ALL
        SELECT '5-10' AS category_name, 3 AS sort_order
        UNION ALL
        SELECT '11-14' AS category_name, 4 AS sort_order
        UNION ALL
        SELECT '15+' AS category_name, 5 AS sort_order 
      ),
      AbsenteeismWithCategorizedDuration AS (
        SELECT
          a."id",
          CASE
            WHEN (ABS(a."timeSpent"::numeric / (24 * 60))) >= 0
            AND (ABS(a."timeSpent"::numeric / (24 * 60))) <= 1 THEN '0-1'
            WHEN (ABS(a."timeSpent"::numeric / (24 * 60))) > 1
            AND (ABS(a."timeSpent"::numeric / (24 * 60))) <= 4 THEN '1-4'
            WHEN (ABS(a."timeSpent"::numeric / (24 * 60))) > 4
            AND (ABS(a."timeSpent"::numeric / (24 * 60))) <= 10 THEN '5-10'
            WHEN (ABS(a."timeSpent"::numeric / (24 * 60))) > 10
            AND (ABS(a."timeSpent"::numeric / (24 * 60))) <= 14 THEN '11-14'
            WHEN (ABS(a."timeSpent"::numeric / (24 * 60))) > 14 THEN '15+' 
            ELSE NULL 
          END AS duration_category_calculated
        FROM
          "Absenteeism" a
        JOIN
          "Employee" e ON a."employeeId" = e.id AND e."deleted_at" IS null AND e."companyId" = ${filters.companyId}
        ${
          filters.hierarchiesIds?.length || filters.workspacesIds?.length
            ? Prisma.sql`
              JOIN
                "EmployeeHierarchyHistory" ehh ON e.id = ehh."employeeId"
              JOIN
                "Hierarchy" h ON ehh."hierarchyId" = h.id AND h."deletedAt" IS null
              LEFT JOIN 
                "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
              JOIN
                "_HierarchyToWorkspace" htw ON h.id = htw."A"
              JOIN
                "Workspace" w ON htw."B" = w.id 
            `
            : Prisma.sql``
        }
        ${gerWhereRawPrisma(whereParams)}
      )
      SELECT
          dc.category_name AS range_string,
          COUNT(awcd.id) AS count
      FROM
          DurationCategories dc
      LEFT JOIN
          AbsenteeismWithCategorizedDuration awcd ON dc.category_name = awcd.duration_category_calculated
      GROUP BY
          dc.category_name, dc.sort_order
      ORDER BY
          dc.sort_order;
    `;

    return AbsenteeismDaysCountReadModelMapper.toModel({
      results: AbsenteeismMetrics,
    });
  }

  async readMotiveCount(filters: IAbsenteeismMetricsDAO.ReadMotiveCountParams) {
    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const AbsenteeismMetrics = await this.prisma.$queryRaw<IAbsenteeismMotiveCountResultReadModelMapper[]>`
        SELECT
          a."motiveId" as motive_id,
          am.desc AS motive_description,
          COUNT(a.id) AS count
        FROM
          "Absenteeism" a
        JOIN
          "AbsenteeismMotive" am ON a."motiveId" = am.id
        JOIN
          "Employee" e ON a."employeeId" = e.id AND e."deleted_at" IS null AND e."companyId" = ${filters.companyId}
        ${
          filters.hierarchiesIds?.length || filters.workspacesIds?.length
            ? Prisma.sql`
              JOIN
                "EmployeeHierarchyHistory" ehh ON e.id = ehh."employeeId"
              JOIN
                "Hierarchy" h ON ehh."hierarchyId" = h.id AND h."deletedAt" IS null
              LEFT JOIN 
                "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
              JOIN
                "_HierarchyToWorkspace" htw ON h.id = htw."A"
              JOIN
                "Workspace" w ON htw."B" = w.id 
            `
            : Prisma.sql``
        }
        ${gerWhereRawPrisma(whereParams)}
        GROUP BY
          a."motiveId",
          am.desc
        ORDER BY
          count DESC,
          motive_description
        LIMIT 8;
    `;

    return AbsenteeismMotiveCountReadModelMapper.toModel({
      results: AbsenteeismMetrics,
    });
  }

  async browseEmployeeTotal({ limit, page, orderBy, filters }: IAbsenteeismMetricsDAO.BrowseEmployeeTotalParams) {
    function filterWhere(filters: IAbsenteeismMetricsDAO.BrowseEmployeeTotalParams['filters']) {
      const where: Prisma.Sql[] = [];

      where.push(Prisma.sql`ehh."startDate" <= a."startDate"`);
      where.push(Prisma.sql`ehh."deletedAt" IS NULL OR ehh."deletedAt" > a."startDate"`);

      if (filters.search) {
        const search = `%${filters.search}%`;
        where.push(Prisma.sql`
          unaccent(lower(e."name")) ILIKE unaccent(lower(${search}))
        `);
      }

      return where;
    }

    function browseOrderBy(orderBy?: IAbsenteeismMetricsDAO.BrowseEmployeeTotalParams['orderBy']) {
      if (!orderBy) return [];

      const map: Record<AbsenteeismEmployeeTotalOrderByEnum, string> = {
        [AbsenteeismEmployeeTotalOrderByEnum.TOTAL]: 'total_absenteeism_count',
        [AbsenteeismEmployeeTotalOrderByEnum.TOTAL_DAYS]: 'total_absenteeism_days',
      };

      const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

      return orderByRaw;
    }

    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = [...filterWhere(filters), ...this.filterWhere(filters)];
    const orderByParams = browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const AbsenteeismMetricsPromise = this.prisma.$queryRaw<IAbsenteeismTotalEmployeeResultBrowseModelMapper[]>`
      SELECT
        e.id AS employee_id,
        e.name AS employee_name,
        COUNT(a.id) AS total_absenteeism_count,
        SUM(ABS(a."timeSpent")) AS total_absenteeism_days
      FROM
        "Absenteeism" a
      JOIN
        "Employee" e ON a."employeeId" = e.id AND e."deleted_at" IS null AND e."companyId" = ${filters.companyId}
      JOIN
        "EmployeeHierarchyHistory" ehh ON e.id = ehh."employeeId"
      ${
        filters.hierarchiesIds?.length || filters.workspacesIds?.length
          ? Prisma.sql`
            JOIN
              "Hierarchy" h ON ehh."hierarchyId" = h.id AND h."deletedAt" IS null
            LEFT JOIN 
              "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId"
            LEFT JOIN 
              "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
            LEFT JOIN 
              "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
            LEFT JOIN 
              "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
            JOIN
              "_HierarchyToWorkspace" htw ON h.id = htw."A"
            JOIN
              "Workspace" w ON htw."B" = w.id 
          `
          : Prisma.sql``
      }
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY
        employee_id
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalAbsenteeismMetricsPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total
      FROM (
        SELECT
          e.id AS employee_id
        FROM
          "Absenteeism" a
        JOIN
          "Employee" e ON a."employeeId" = e.id AND e."deleted_at" IS null AND e."companyId" = ${filters.companyId}
        JOIN
          "EmployeeHierarchyHistory" ehh ON e.id = ehh."employeeId"
        ${
          filters.hierarchiesIds?.length || filters.workspacesIds?.length
            ? Prisma.sql`
              JOIN
                "Hierarchy" h ON ehh."hierarchyId" = h.id AND h."deletedAt" IS null
              LEFT JOIN 
                "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
              LEFT JOIN 
                "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
              JOIN
                "_HierarchyToWorkspace" htw ON h.id = htw."A"
              JOIN
                "Workspace" w ON htw."B" = w.id 
            `
            : Prisma.sql``
        }
        ${gerWhereRawPrisma(whereParams)}
        GROUP BY
          employee_id
      ) AS subquery
    `;

    const [AbsenteeismMetrics, totalAbsenteeismMetrics] = await Promise.all([AbsenteeismMetricsPromise, totalAbsenteeismMetricsPromise]);

    return AbsenteeismTotalEmployeeBrowseModelMapper.toModel({
      results: AbsenteeismMetrics,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalAbsenteeismMetrics[0].total) },
    });
  }

  async browseHierarchyTotal({ limit, page, orderBy, filters }: IAbsenteeismMetricsDAO.BrowseHierarchyTotalParams) {
    function filterWhere(filters: IAbsenteeismMetricsDAO.BrowseHierarchyTotalParams['filters']) {
      const where: Prisma.Sql[] = [];

      where.push(Prisma.sql`ehh."startDate" <= a."startDate"`);
      where.push(Prisma.sql`ehh."deletedAt" IS NULL OR ehh."deletedAt" > a."startDate"`);

      if (filters.search) {
        const search = `%${filters.search}%`;
        where.push(Prisma.sql`
          unaccent(lower(h."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_parent_1."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_parent_2."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_parent_3."name")) ILIKE unaccent(lower(${search})) OR
          unaccent(lower(h_parent_4."name")) ILIKE unaccent(lower(${search})) 
        `);
      }

      return where;
    }

    function browseOrderBy(orderBy?: IAbsenteeismMetricsDAO.BrowseHierarchyTotalParams['orderBy']) {
      if (!orderBy) return [];

      const map: Record<AbsenteeismHierarchyTotalOrderByEnum, string> = {
        [AbsenteeismHierarchyTotalOrderByEnum.AVERAGE_DAYS]: 'avg_absenteeism_per_employee',
        [AbsenteeismHierarchyTotalOrderByEnum.TOTAL]: 'total_absenteeism_count',
        [AbsenteeismHierarchyTotalOrderByEnum.TOTAL_DAYS]: 'total_absenteeism_days',
      };

      const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

      return orderByRaw;
    }

    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = [...filterWhere(filters), ...this.filterWhere(filters)];
    const orderByParams = browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const showOffice = !filters.type || AbsenteeismHierarchyTypeEnum.OFFICE == filters.type;
    const showSector = showOffice || AbsenteeismHierarchyTypeEnum.SECTOR == filters.type;
    const showManagement = showOffice || showSector || AbsenteeismHierarchyTypeEnum.MANAGEMENT == filters.type;
    const showDirectory = showOffice || showSector || showManagement || AbsenteeismHierarchyTypeEnum.DIRECTORY == filters.type;
    // const showWorkspace = showOffice || showSector || showManagement || showDirectory || AbsenteeismHierarchyTypeEnum.WORKSPACE == filters.type;

    const AbsenteeismMetricsPromise = this.prisma.$queryRaw<IAbsenteeismTotalHierarchyResultBrowseModelMapper[]>`
      SELECT
        ${gerRawPrisma(`h.name AS hierarchy_name,`, showOffice)}
        ${gerRawPrisma(`h.type AS hierarchy_type,`, showOffice)}
        ${gerRawPrisma(`h.id AS hierarchy_id,`, showOffice)}

        ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.id ELSE NULL END AS hierarchy_parent_1_id,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.name ELSE NULL END AS hierarchy_parent_1_name,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.type ELSE NULL END AS hierarchy_parent_1_type,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.id ELSE NULL END AS hierarchy_parent_2_id,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.name ELSE NULL END AS hierarchy_parent_2_name,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.type ELSE NULL END AS hierarchy_parent_2_type,`, showSector)}

        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.id ELSE NULL END AS hierarchy_parent_2_id,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.name ELSE NULL END AS hierarchy_parent_2_name,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.type ELSE NULL END AS hierarchy_parent_2_type,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.id ELSE NULL END AS hierarchy_parent_3_id,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.name ELSE NULL END AS hierarchy_parent_3_name,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.type ELSE NULL END AS hierarchy_parent_3_type,`, showManagement)}

        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.id ELSE NULL END AS hierarchy_parent_2_id,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.name ELSE NULL END AS hierarchy_parent_2_name,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.type ELSE NULL END AS hierarchy_parent_2_type,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.id ELSE NULL END AS hierarchy_parent_3_id,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.name ELSE NULL END AS hierarchy_parent_3_name,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.type ELSE NULL END AS hierarchy_parent_3_type,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.id ELSE NULL END AS hierarchy_parent_4_id,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.name ELSE NULL END AS hierarchy_parent_4_name,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.type ELSE NULL END AS hierarchy_parent_4_type,`, showDirectory)}

        w.id AS workspace_id,
        w.name AS workspace_name,
        COUNT(a.id) AS total_absenteeism_count,
        SUM(ABS(a."timeSpent")) AS total_absenteeism_days,
        (SUM(ABS(a."timeSpent"))) / NULLIF(COUNT(DISTINCT a."employeeId"), 0) AS avg_absenteeism_per_employee
      FROM
        "Absenteeism" a
      JOIN
        "Employee" e ON a."employeeId" = e.id AND e."deleted_at" IS null AND e."companyId" = ${filters.companyId}
      JOIN
        "EmployeeHierarchyHistory" ehh ON e.id = ehh."employeeId"
      JOIN
        "Hierarchy" h ON ehh."hierarchyId" = h.id AND h."deletedAt" IS null
      LEFT JOIN 
        "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId" 
      LEFT JOIN 
        "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
      LEFT JOIN 
        "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
      LEFT JOIN 
        "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
      JOIN
        "_HierarchyToWorkspace" htw ON h.id = htw."A"
      JOIN
        "Workspace" w ON htw."B" = w.id 
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY
        ${gerRawPrisma(`h."id",`, showOffice)}
        ${gerRawPrisma(`h."name",`, showOffice)}
        ${gerRawPrisma(`h."type",`, showOffice)}
        
        ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.id ELSE NULL END,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.name ELSE NULL END,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.type ELSE NULL END,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.id ELSE NULL END,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.name ELSE NULL END,`, showSector)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.type ELSE NULL END,`, showSector)}

        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.id ELSE NULL END,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.name ELSE NULL END,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.type ELSE NULL END,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.id ELSE NULL END,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.name ELSE NULL END,`, showManagement)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.type ELSE NULL END,`, showManagement)}

        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.id ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.name ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.type ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.id ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.name ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.type ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.id ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.name ELSE NULL END,`, showDirectory)}
        ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.type ELSE NULL END,`, showDirectory)}

        w."id",
        w."name"
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalAbsenteeismMetricsPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total
      FROM (
        SELECT 
          ${gerRawPrisma(`h.id AS hierarchy_id,`, showOffice)}

          ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.id ELSE NULL END AS hierarchy_parent_1_id,`, AbsenteeismHierarchyTypeEnum.SECTOR == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.id ELSE NULL END AS hierarchy_parent_2_id,`, AbsenteeismHierarchyTypeEnum.SECTOR == filters.type)}

          ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.id ELSE NULL END AS hierarchy_parent_2_id,`, AbsenteeismHierarchyTypeEnum.MANAGEMENT == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.id ELSE NULL END AS hierarchy_parent_3_id,`, AbsenteeismHierarchyTypeEnum.MANAGEMENT == filters.type)}

          ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.id ELSE NULL END AS hierarchy_parent_2_id,`, AbsenteeismHierarchyTypeEnum.DIRECTORY == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.id ELSE NULL END AS hierarchy_parent_3_id,`, AbsenteeismHierarchyTypeEnum.DIRECTORY == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.id ELSE NULL END AS hierarchy_parent_4_id,`, AbsenteeismHierarchyTypeEnum.DIRECTORY == filters.type)}
          w.id AS workspace_id
        FROM
          "Absenteeism" a
        JOIN
          "Employee" e ON a."employeeId" = e.id AND e."deleted_at" IS null AND e."companyId" = ${filters.companyId}
        JOIN
          "EmployeeHierarchyHistory" ehh ON e.id = ehh."employeeId"
        JOIN
          "Hierarchy" h ON ehh."hierarchyId" = h.id AND h."deletedAt" IS null
        LEFT JOIN 
          "Hierarchy" h_parent_1 ON h_parent_1."id" = h."parentId"
        LEFT JOIN 
          "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
        LEFT JOIN 
          "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
        LEFT JOIN 
          "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
        JOIN
          "_HierarchyToWorkspace" htw ON h.id = htw."A"
        JOIN
          "Workspace" w ON htw."B" = w.id 
        ${gerWhereRawPrisma(whereParams)}
        GROUP BY
          ${gerRawPrisma(`h."id",`, showOffice)}
          
          ${gerRawPrisma(`CASE WHEN h_parent_1.type::text = 'SECTOR' THEN h_parent_1.id ELSE NULL END,`, AbsenteeismHierarchyTypeEnum.SECTOR == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'SECTOR' THEN h_parent_2.id ELSE NULL END,`, AbsenteeismHierarchyTypeEnum.SECTOR == filters.type)}

          ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'MANAGEMENT' THEN h_parent_2.id ELSE NULL END,`, AbsenteeismHierarchyTypeEnum.MANAGEMENT == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'MANAGEMENT' THEN h_parent_3.id ELSE NULL END,`, AbsenteeismHierarchyTypeEnum.MANAGEMENT == filters.type)}

          ${gerRawPrisma(`CASE WHEN h_parent_2.type::text = 'DIRECTORY' THEN h_parent_2.id ELSE NULL END,`, AbsenteeismHierarchyTypeEnum.DIRECTORY == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_3.type::text = 'DIRECTORY' THEN h_parent_3.id ELSE NULL END,`, AbsenteeismHierarchyTypeEnum.DIRECTORY == filters.type)}
          ${gerRawPrisma(`CASE WHEN h_parent_4.type::text = 'DIRECTORY' THEN h_parent_4.id ELSE NULL END,`, AbsenteeismHierarchyTypeEnum.DIRECTORY == filters.type)}

          w."id"
      ) AS subquery
    `;

    const filterAbsenteeismMetricsPromise = this.prisma.$queryRaw<{ types: HierarchyEnum[] }[]>`
      SELECT
          ARRAY_AGG(DISTINCT h.type) AS types
      FROM
          "Hierarchy" h
      WHERE
          h."companyId" = ${filters.companyId}
          AND h."deletedAt" IS NULL;
    `;

    const [AbsenteeismMetrics, totalAbsenteeismMetrics, filterAbsenteeismMetrics] = await Promise.all([AbsenteeismMetricsPromise, totalAbsenteeismMetricsPromise, filterAbsenteeismMetricsPromise]);

    return AbsenteeismTotalHierarchyBrowseModelMapper.toModel({
      results: AbsenteeismMetrics,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalAbsenteeismMetrics[0].total) },
      filters: {
        types: filterAbsenteeismMetrics[0].types,
      },
    });
  }

  private browseWhere(filters: IAbsenteeismMetricsDAO.FilterCommonParams, options?: { addYear: number }) {
    const { startDate, endDate } = gerRageDate(filters, options);

    const where = [Prisma.sql`a."startDate" >= ${startDate} AND a."startDate" <= ${endDate}`];

    return where;
  }

  private filterWhere(filters: IAbsenteeismMetricsDAO.FilterCommonParams) {
    const where: Prisma.Sql[] = [];

    if (filters.hierarchiesIds?.length) {
      where.push(Prisma.sql`
        h.id IN (${Prisma.join(filters.hierarchiesIds)}) OR
        h_parent_1.id IN (${Prisma.join(filters.hierarchiesIds)}) OR
        h_parent_2.id IN (${Prisma.join(filters.hierarchiesIds)}) OR
        h_parent_3.id IN (${Prisma.join(filters.hierarchiesIds)}) OR
        h_parent_4.id IN (${Prisma.join(filters.hierarchiesIds)})
      `);
    }

    if (filters.workspacesIds?.length) {
      where.push(Prisma.sql`
        w."id" IN (${Prisma.join(filters.workspacesIds)})
      `);
    }

    if (filters.motivesIds?.length) {
      where.push(Prisma.sql`
        a."motiveId" IN (${Prisma.join(filters.motivesIds)})
      `);
    }

    return where;
  }
}
