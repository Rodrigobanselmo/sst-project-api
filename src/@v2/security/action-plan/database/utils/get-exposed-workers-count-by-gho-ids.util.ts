import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Prisma } from '@prisma/client';

export type ExposedWorkersCountRow = {
  hg_id: string;
  exposed_workers_count: number;
};

export async function getExposedWorkersCountByGhoIds(
  prisma: PrismaServiceV2,
  companyId: string,
  ghoIds: string[],
): Promise<Record<string, number>> {
  if (!ghoIds.length) return {};

  const rows = await prisma.$queryRaw<ExposedWorkersCountRow[]>`
    WITH RECURSIVE gho_hierarchies AS (
      SELECT
        hh."homogeneousGroupId" AS hg_id,
        hh."hierarchyId" AS hierarchy_id
      FROM "HierarchyOnHomogeneous" hh
      INNER JOIN "HomogeneousGroup" hg_inner ON hg_inner.id = hh."homogeneousGroupId"
      WHERE hh."endDate" IS NULL
        AND hg_inner."companyId" = ${companyId}
        AND hg_inner."deletedAt" IS NULL
        AND hh."homogeneousGroupId" IN (${Prisma.join(ghoIds)})

      UNION ALL

      SELECT
        gh.hg_id,
        h.id
      FROM gho_hierarchies gh
      INNER JOIN "Hierarchy" h ON h."parentId" = gh.hierarchy_id
      WHERE h."deletedAt" IS NULL
        AND h."companyId" = ${companyId}
    )
    SELECT
      gh.hg_id,
      COUNT(DISTINCT e.id)::integer AS exposed_workers_count
    FROM gho_hierarchies gh
    LEFT JOIN "Employee" e
      ON e."hierarchyId" = gh.hierarchy_id
      AND e."companyId" = ${companyId}
      AND e."deleted_at" IS NULL
    GROUP BY gh.hg_id
  `;

  return Object.fromEntries(
    rows.map((row) => [row.hg_id, Number(row.exposed_workers_count)]),
  );
}

export function buildGhoExposedWorkersCte(companyId: string) {
  return Prisma.sql`
    "GhoExposedWorkers" AS (
      WITH RECURSIVE gho_hierarchies AS (
        SELECT
          hh."homogeneousGroupId" AS hg_id,
          hh."hierarchyId" AS hierarchy_id
        FROM "HierarchyOnHomogeneous" hh
        INNER JOIN "HomogeneousGroup" hg_inner ON hg_inner.id = hh."homogeneousGroupId"
        WHERE hh."endDate" IS NULL
          AND hg_inner."companyId" = ${companyId}
          AND hg_inner."deletedAt" IS NULL

        UNION ALL

        SELECT
          gh.hg_id,
          h.id
        FROM gho_hierarchies gh
        INNER JOIN "Hierarchy" h ON h."parentId" = gh.hierarchy_id
        WHERE h."deletedAt" IS NULL
          AND h."companyId" = ${companyId}
      )
      SELECT
        gh.hg_id,
        COUNT(DISTINCT e.id)::integer AS exposed_workers_count
      FROM gho_hierarchies gh
      LEFT JOIN "Employee" e
        ON e."hierarchyId" = gh.hierarchy_id
        AND e."companyId" = ${companyId}
        AND e."deleted_at" IS NULL
      GROUP BY gh.hg_id
    )
  `;
}
