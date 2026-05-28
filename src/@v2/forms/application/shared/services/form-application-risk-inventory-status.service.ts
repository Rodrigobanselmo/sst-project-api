import { resolveOperationalCompanyIdForHierarchy } from '@/@v2/forms/application/shared/helpers/resolve-operational-company-for-hierarchy.helper';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';

export type RiskInventoryPair = {
  riskId: string;
  hierarchyId: string;
};

@Injectable()
export class FormApplicationRiskInventoryStatusService {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  buildStatusKey(riskId: string, hierarchyId: string): string {
    return `${riskId}:${hierarchyId}`;
  }

  async buildInventoryStatusByKey(params: {
    formApplicationId: string;
    accessCompanyId: string;
    entityRiskMap: Record<string, Record<string, unknown>>;
  }): Promise<Record<string, boolean>> {
    const pairs: RiskInventoryPair[] = [];

    for (const [hierarchyId, risks] of Object.entries(params.entityRiskMap)) {
      for (const riskId of Object.keys(risks ?? {})) {
        pairs.push({ riskId, hierarchyId });
      }
    }

    return this.resolveInventoryStatusForPairs({
      formApplicationId: params.formApplicationId,
      accessCompanyId: params.accessCompanyId,
      pairs,
    });
  }

  async resolveInventoryStatusForPairs(params: {
    formApplicationId: string;
    accessCompanyId: string;
    pairs: RiskInventoryPair[];
  }): Promise<Record<string, boolean>> {
    const uniquePairs = Array.from(
      new Map(
        params.pairs.map((pair) => [
          this.buildStatusKey(pair.riskId, pair.hierarchyId),
          pair,
        ]),
      ).values(),
    );

    const result: Record<string, boolean> = {};
    for (const pair of uniquePairs) {
      result[this.buildStatusKey(pair.riskId, pair.hierarchyId)] = false;
    }

    if (uniquePairs.length === 0) {
      return result;
    }

    const uniqueHierarchyIds = [
      ...new Set(uniquePairs.map((pair) => pair.hierarchyId)),
    ];
    const uniqueRiskIds = [...new Set(uniquePairs.map((pair) => pair.riskId))];

    const operationalCompanyByHierarchy = new Map<string, string>();

    for (const hierarchyId of uniqueHierarchyIds) {
      try {
        const operationalCompanyId = await resolveOperationalCompanyIdForHierarchy({
          prisma: this.prisma,
          formApplicationScopeService: this.formApplicationScopeService,
          formApplicationId: params.formApplicationId,
          accessCompanyId: params.accessCompanyId,
          hierarchyId,
        });
        operationalCompanyByHierarchy.set(hierarchyId, operationalCompanyId);
      } catch {
        // Setor fora do escopo ou hierarquia inexistente — trata como ausente no inventário.
      }
    }

    const uniqueCompanyIds = [
      ...new Set(operationalCompanyByHierarchy.values()),
    ];

    if (uniqueCompanyIds.length === 0) {
      return result;
    }

    const groupDataRows = await this.prisma.riskFactorGroupData.findMany({
      where: { companyId: { in: uniqueCompanyIds } },
      select: { id: true, companyId: true },
      orderBy: { created_at: 'asc' },
    });

    const groupDataIdByCompany = new Map<string, string>();
    for (const row of groupDataRows) {
      if (!groupDataIdByCompany.has(row.companyId)) {
        groupDataIdByCompany.set(row.companyId, row.id);
      }
    }

    const companyIdsWithGroup = uniqueCompanyIds.filter((companyId) =>
      groupDataIdByCompany.has(companyId),
    );

    if (companyIdsWithGroup.length === 0) {
      return result;
    }

    const riskDataRows = await this.prisma.riskFactorData.findMany({
      where: {
        companyId: { in: companyIdsWithGroup },
        riskId: { in: uniqueRiskIds },
        endDate: null,
        deletedAt: null,
        OR: [
          { homogeneousGroupId: { in: uniqueHierarchyIds } },
          { hierarchyId: { in: uniqueHierarchyIds } },
        ],
      },
      select: {
        riskId: true,
        companyId: true,
        riskFactorGroupDataId: true,
        homogeneousGroupId: true,
        hierarchyId: true,
      },
    });

    const inInventoryKeys = new Set<string>();

    for (const row of riskDataRows) {
      const candidateHierarchyIds = new Set<string>();
      if (row.homogeneousGroupId) {
        candidateHierarchyIds.add(row.homogeneousGroupId);
      }
      if (row.hierarchyId) {
        candidateHierarchyIds.add(row.hierarchyId);
      }

      for (const hierarchyId of candidateHierarchyIds) {
        const operationalCompanyId =
          operationalCompanyByHierarchy.get(hierarchyId);
        if (!operationalCompanyId || row.companyId !== operationalCompanyId) {
          continue;
        }

        const expectedGroupDataId = groupDataIdByCompany.get(operationalCompanyId);
        if (
          !expectedGroupDataId ||
          row.riskFactorGroupDataId !== expectedGroupDataId
        ) {
          continue;
        }

        inInventoryKeys.add(this.buildStatusKey(row.riskId, hierarchyId));
      }
    }

    for (const key of Object.keys(result)) {
      result[key] = inInventoryKeys.has(key);
    }

    return result;
  }
}
