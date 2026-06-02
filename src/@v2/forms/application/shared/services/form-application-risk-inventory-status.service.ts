import { resolveOperationalCompanyIdForHierarchy } from '@/@v2/forms/application/shared/helpers/resolve-operational-company-for-hierarchy.helper';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import {
  AnalysisInventoryStatusMap,
  AnalysisItemInventoryEntry,
  AnalysisItemInventoryStatus,
} from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-analysis-browse.model';
import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import {
  addRecMedCatalogMatchKeysToSet,
  catalogNameSetHas,
  inventoryNameSetHas,
  normalizeInventoryItemName,
} from '@/shared/utils/normalize-inventory-item-name.util';
import {
  buildBatchRecMedCatalogVisibilityWhere,
  buildBatchRiskCatalogVisibilityWhere,
  isRiskCatalogRecordVisibleForCompany,
} from '@/shared/utils/risk-catalog-visibility.util';
import { enrichCatalogNameSetsWithEquivalences } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.util';
import { RiskCatalogEquivalenceService } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.service';
import { Injectable } from '@nestjs/common';
import { MeasuresTypeEnum, RecTypeEnum, RiskCatalogKind } from '@prisma/client';

export type RiskInventoryPair = {
  riskId: string;
  hierarchyId: string;
};

export type {
  AnalysisItemInventoryEntry,
  AnalysisItemInventoryStatus,
  AnalysisInventoryStatusMap,
};

export { normalizeInventoryItemName } from '@/shared/utils/normalize-inventory-item-name.util';

type AnalysisForItemInventoryStatus = {
  id: string;
  riskId: string;
  hierarchyId: string;
  analysis?: AiRiskAnalysisResponse | null;
};

/** Catálogo visível (dropdown) + subconjuntos tipados para inventário. */
type RiskCatalogNameSets = {
  generateSources: Set<string>;
  /** RecSelect (`onlyRec`) — qualquer recomendação com recName, independente de recType. */
  recommendationRecNames: Set<string>;
  /** MedSelect (`onlyMed`) — medidas com medName. */
  measureMedNames: Set<string>;
  engineeringMeasures: Set<string>;
  administrativeMeasures: Set<string>;
};

@Injectable()
export class FormApplicationRiskInventoryStatusService {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
    private readonly riskCatalogEquivalenceService: RiskCatalogEquivalenceService,
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

  async buildAnalysisInventoryStatus(params: {
    formApplicationId: string;
    accessCompanyId: string;
    analyses: AnalysisForItemInventoryStatus[];
  }): Promise<AnalysisInventoryStatusMap> {
    const result: AnalysisInventoryStatusMap = {};

    for (const analysis of params.analyses) {
      result[analysis.id] = this.buildEmptyItemStatus(analysis.analysis);
    }

    if (params.analyses.length === 0) {
      return result;
    }

    const pairs = params.analyses.map((analysis) => ({
      riskId: analysis.riskId,
      hierarchyId: analysis.hierarchyId,
    }));

    const operationalCompanyByHierarchy =
      await this.resolveOperationalCompanyByHierarchy({
        formApplicationId: params.formApplicationId,
        accessCompanyId: params.accessCompanyId,
        hierarchyIds: [
          ...new Set(params.analyses.map((analysis) => analysis.hierarchyId)),
        ],
      });

    const catalogNamesByRiskCompanyKey =
      await this.buildCatalogNamesByRiskCompanyKey({
        analyses: params.analyses,
        operationalCompanyByHierarchy,
      });

    const riskFactorDataIdByKey = await this.resolveActiveRiskFactorDataIdByPair({
      formApplicationId: params.formApplicationId,
      accessCompanyId: params.accessCompanyId,
      pairs,
    });

    const riskFactorDataIds = [
      ...new Set(
        [...riskFactorDataIdByKey.values()].filter(
          (id): id is string => typeof id === 'string',
        ),
      ),
    ];

    const inventoryNamesByRiskDataId =
      riskFactorDataIds.length > 0
        ? await this.buildInventoryNamesByRiskDataId(riskFactorDataIds)
        : new Map<
            string,
            {
              generateSources: Set<string>;
              engineeringMeasures: Set<string>;
              administrativeMeasures: Set<string>;
            }
          >();

    for (const analysis of params.analyses) {
      const operationalCompanyId = operationalCompanyByHierarchy.get(
        analysis.hierarchyId,
      );
      const catalogKey =
        operationalCompanyId != null
          ? this.buildRiskCompanyKey(analysis.riskId, operationalCompanyId)
          : null;
      const catalogNames = catalogKey
        ? catalogNamesByRiskCompanyKey.get(catalogKey)
        : undefined;

      const pairKey = this.buildStatusKey(analysis.riskId, analysis.hierarchyId);
      const riskFactorDataId = riskFactorDataIdByKey.get(pairKey);
      const inventoryNames = riskFactorDataId
        ? inventoryNamesByRiskDataId.get(riskFactorDataId)
        : undefined;

      result[analysis.id] = this.buildItemStatusForAnalysis({
        analysis: analysis.analysis,
        inventoryNames,
        catalogNames,
      });
    }

    return result;
  }

  private buildRiskCompanyKey(riskId: string, companyId: string): string {
    return `${riskId}:${companyId}`;
  }

  private buildItemEntry(params: {
    itemName: string;
    inventoryNames?: Set<string>;
    catalogNames?: Set<string>;
    useRecMedCatalogMatching?: boolean;
  }): AnalysisItemInventoryEntry {
    const normalized = normalizeInventoryItemName(params.itemName);
    const existsInCatalog =
      !!normalized &&
      !!params.catalogNames &&
      (params.useRecMedCatalogMatching
        ? catalogNameSetHas(params.catalogNames, params.itemName)
        : inventoryNameSetHas(params.catalogNames, params.itemName));

    return {
      existsInInventory:
        !!normalized &&
        (params.inventoryNames
          ? inventoryNameSetHas(params.inventoryNames, params.itemName)
          : false),
      existsInCatalog,
    };
  }

  private buildItemStatusForAnalysis(params: {
    analysis?: AiRiskAnalysisResponse | null;
    inventoryNames?: {
      generateSources: Set<string>;
      engineeringMeasures: Set<string>;
      administrativeMeasures: Set<string>;
    };
    catalogNames?: RiskCatalogNameSets;
  }): AnalysisItemInventoryStatus {
    return {
      fontesGeradoras: (params.analysis?.fontesGeradoras ?? []).map((item) =>
        this.buildItemEntry({
          itemName: item.nome,
          inventoryNames: params.inventoryNames?.generateSources,
          catalogNames: params.catalogNames?.generateSources,
        }),
      ),
      medidasEngenhariaRecomendadas: (
        params.analysis?.medidasEngenhariaRecomendadas ?? []
      ).map((item) =>
        this.buildItemEntry({
          itemName: item.nome,
          inventoryNames: params.inventoryNames?.engineeringMeasures,
          catalogNames:
            params.catalogNames?.measureMedNames ??
            params.catalogNames?.engineeringMeasures,
          useRecMedCatalogMatching: true,
        }),
      ),
      medidasAdministrativasRecomendadas: (
        params.analysis?.medidasAdministrativasRecomendadas ?? []
      ).map((item) =>
        this.buildItemEntry({
          itemName: item.nome,
          inventoryNames: params.inventoryNames?.administrativeMeasures,
          catalogNames:
            params.catalogNames?.recommendationRecNames ??
            params.catalogNames?.administrativeMeasures,
          useRecMedCatalogMatching: true,
        }),
      ),
    };
  }

  private async resolveOperationalCompanyByHierarchy(params: {
    formApplicationId: string;
    accessCompanyId: string;
    hierarchyIds: string[];
  }): Promise<Map<string, string>> {
    const result = new Map<string, string>();

    for (const hierarchyId of params.hierarchyIds) {
      try {
        const operationalCompanyId = await resolveOperationalCompanyIdForHierarchy({
          prisma: this.prisma,
          formApplicationScopeService: this.formApplicationScopeService,
          formApplicationId: params.formApplicationId,
          accessCompanyId: params.accessCompanyId,
          hierarchyId,
        });
        result.set(hierarchyId, operationalCompanyId);
      } catch {
        // Setor fora do escopo ou hierarquia inexistente.
      }
    }

    return result;
  }

  private async buildCatalogNamesByRiskCompanyKey(params: {
    analyses: AnalysisForItemInventoryStatus[];
    operationalCompanyByHierarchy: Map<string, string>;
  }): Promise<Map<string, RiskCatalogNameSets>> {
    const result = new Map<string, RiskCatalogNameSets>();

    const riskCompanyPairs: Array<{ riskId: string; companyId: string }> = [];
    const seenKeys = new Set<string>();

    for (const analysis of params.analyses) {
      const companyId = params.operationalCompanyByHierarchy.get(
        analysis.hierarchyId,
      );
      if (!companyId) continue;

      const key = this.buildRiskCompanyKey(analysis.riskId, companyId);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      riskCompanyPairs.push({ riskId: analysis.riskId, companyId });
      result.set(key, {
        generateSources: new Set<string>(),
        recommendationRecNames: new Set<string>(),
        measureMedNames: new Set<string>(),
        engineeringMeasures: new Set<string>(),
        administrativeMeasures: new Set<string>(),
      });
    }

    if (riskCompanyPairs.length === 0) {
      return result;
    }

    const uniqueRiskIds = [...new Set(riskCompanyPairs.map((pair) => pair.riskId))];
    const uniqueCompanyIds = [
      ...new Set(riskCompanyPairs.map((pair) => pair.companyId)),
    ];

    const riskTypeRows = await this.prisma.riskFactors.findMany({
      where: { id: { in: uniqueRiskIds } },
      select: { id: true, type: true },
    });
    const riskTypeById = new Map(riskTypeRows.map((row) => [row.id, row.type]));
    const uniqueRiskTypes = [
      ...new Set(riskTypeRows.map((row) => row.type)),
    ];

    const generateSourceRows = await this.prisma.generateSource.findMany({
      where: buildBatchRiskCatalogVisibilityWhere({
        riskIds: uniqueRiskIds,
        companyIds: uniqueCompanyIds,
      }),
      select: {
        riskId: true,
        companyId: true,
        name: true,
        system: true,
        company: {
          select: {
            applyingServiceContracts: {
              where: {
                receivingServiceCompanyId: { in: uniqueCompanyIds },
                status: 'ACTIVE',
              },
              select: { receivingServiceCompanyId: true },
            },
          },
        },
      },
    });

    for (const row of generateSourceRows) {
      const normalized = normalizeInventoryItemName(row.name);
      if (!normalized) continue;

      const contractReceiverCompanyIds =
        row.company.applyingServiceContracts?.map(
          (contract) => contract.receivingServiceCompanyId,
        ) ?? [];

      for (const pair of riskCompanyPairs) {
        if (pair.riskId !== row.riskId) continue;
        if (
          !isRiskCatalogRecordVisibleForCompany(
            {
              companyId: row.companyId,
              system: row.system,
              contractReceiverCompanyIds,
            },
            pair.companyId,
          )
        ) {
          continue;
        }

        const catalog = result.get(this.buildRiskCompanyKey(pair.riskId, pair.companyId));
        catalog?.generateSources.add(normalized);
      }
    }

    const recMedRows = await this.prisma.recMed.findMany({
      where: buildBatchRecMedCatalogVisibilityWhere({
        riskIds: uniqueRiskIds,
        companyIds: uniqueCompanyIds,
        riskTypes: uniqueRiskTypes,
      }),
      select: {
        riskId: true,
        companyId: true,
        recName: true,
        medName: true,
        recType: true,
        medType: true,
        system: true,
        risk: { select: { representAll: true, type: true } },
        company: {
          select: {
            applyingServiceContracts: {
              where: {
                receivingServiceCompanyId: { in: uniqueCompanyIds },
                status: 'ACTIVE',
              },
              select: { receivingServiceCompanyId: true },
            },
          },
        },
      },
    });

    for (const row of recMedRows) {
      const normalizedNames = this.getRecMedNormalizedNames(row);
      if (normalizedNames.length === 0) continue;

      const contractReceiverCompanyIds =
        row.company.applyingServiceContracts?.map(
          (contract) => contract.receivingServiceCompanyId,
        ) ?? [];

      for (const pair of riskCompanyPairs) {
        const pairRiskType = riskTypeById.get(pair.riskId);
        const appliesToPairRisk =
          row.riskId === pair.riskId ||
          (row.risk.representAll &&
            pairRiskType != null &&
            row.risk.type === pairRiskType);
        if (!appliesToPairRisk) continue;

        if (
          !isRiskCatalogRecordVisibleForCompany(
            {
              companyId: row.companyId,
              system: row.system,
              contractReceiverCompanyIds,
            },
            pair.companyId,
          )
        ) {
          continue;
        }

        const catalog = result.get(this.buildRiskCompanyKey(pair.riskId, pair.companyId));
        if (!catalog) continue;

        addRecMedCatalogMatchKeysToSet(catalog.recommendationRecNames, row.recName);
        addRecMedCatalogMatchKeysToSet(catalog.measureMedNames, row.medName);

        if (this.isAdministrativeRecMed(row)) {
          for (const name of normalizedNames) {
            catalog.administrativeMeasures.add(name);
          }
        }

        if (this.isEngineeringRecMed(row)) {
          for (const name of normalizedNames) {
            catalog.engineeringMeasures.add(name);
          }
        }
      }
    }

    const [generateSourceEquivalences, recMedEquivalences] = await Promise.all([
      this.riskCatalogEquivalenceService.findActiveByRiskIds(
        RiskCatalogKind.GENERATE_SOURCE,
        uniqueRiskIds,
      ),
      this.riskCatalogEquivalenceService.findActiveByRiskIds(
        RiskCatalogKind.REC_MED,
        uniqueRiskIds,
      ),
    ]);

    const gsEquivalencesByRiskId = this.groupEquivalencesByRiskId(
      generateSourceEquivalences,
    );
    const recEquivalencesByRiskId = this.groupEquivalencesByRiskId(recMedEquivalences);

    for (const pair of riskCompanyPairs) {
      const catalog = result.get(this.buildRiskCompanyKey(pair.riskId, pair.companyId));
      if (!catalog) continue;

      const equivalences = [
        ...(gsEquivalencesByRiskId.get(pair.riskId) ?? []),
        ...(recEquivalencesByRiskId.get(pair.riskId) ?? []),
      ];
      enrichCatalogNameSetsWithEquivalences(catalog, equivalences);
    }

    return result;
  }

  private groupEquivalencesByRiskId<T extends { riskId: string }>(
    rows: T[],
  ): Map<string, T[]> {
    const map = new Map<string, T[]>();
    for (const row of rows) {
      const list = map.get(row.riskId) ?? [];
      list.push(row);
      map.set(row.riskId, list);
    }
    return map;
  }

  private async buildInventoryNamesByRiskDataId(riskFactorDataIds: string[]) {
    const inventoryNamesByRiskDataId = new Map<
      string,
      {
        generateSources: Set<string>;
        engineeringMeasures: Set<string>;
        administrativeMeasures: Set<string>;
      }
    >();

    const riskDataRows = await this.prisma.riskFactorData.findMany({
      where: { id: { in: riskFactorDataIds } },
      select: {
        id: true,
        generateSources: { select: { name: true } },
        adms: {
          select: {
            recName: true,
            medName: true,
            recType: true,
            medType: true,
          },
        },
        engsToRiskFactorData: {
          select: {
            recMed: {
              select: { recName: true, medName: true, recType: true },
            },
          },
        },
        recs: {
          select: {
            recMed: {
              select: {
                recName: true,
                medName: true,
                recType: true,
                medType: true,
              },
            },
          },
        },
      },
    });

    for (const row of riskDataRows) {
      const generateSources = new Set<string>();
      for (const source of row.generateSources) {
        const normalized = normalizeInventoryItemName(source.name);
        if (normalized) generateSources.add(normalized);
      }

      const engineeringMeasures = new Set<string>();
      for (const eng of row.engsToRiskFactorData) {
        const normalized = normalizeInventoryItemName(
          this.getRecMedDisplayName(eng.recMed),
        );
        if (normalized) engineeringMeasures.add(normalized);
      }
      for (const rec of row.recs) {
        if (!this.isEngineeringRecMed(rec.recMed)) continue;
        const normalized = normalizeInventoryItemName(
          this.getRecMedDisplayName(rec.recMed),
        );
        if (normalized) engineeringMeasures.add(normalized);
      }

      const administrativeMeasures = new Set<string>();
      for (const adm of row.adms) {
        if (!this.isAdministrativeRecMed(adm)) continue;
        const normalized = normalizeInventoryItemName(
          this.getRecMedDisplayName(adm),
        );
        if (normalized) administrativeMeasures.add(normalized);
      }
      // Apply de análise de IA usa recAddOnly (RecMedOnRiskData / recs), não adms.
      for (const rec of row.recs) {
        if (!this.isAdministrativeRecMed(rec.recMed)) continue;
        const normalized = normalizeInventoryItemName(
          this.getRecMedDisplayName(rec.recMed),
        );
        if (normalized) administrativeMeasures.add(normalized);
      }

      inventoryNamesByRiskDataId.set(row.id, {
        generateSources,
        engineeringMeasures,
        administrativeMeasures,
      });
    }

    return inventoryNamesByRiskDataId;
  }

  private getRecMedNormalizedNames(recMed: {
    recName: string | null;
    medName: string | null;
  }): string[] {
    const names = new Set<string>();
    const recName = normalizeInventoryItemName(recMed.recName);
    const medName = normalizeInventoryItemName(recMed.medName);
    if (recName) names.add(recName);
    if (medName) names.add(medName);
    return [...names];
  }

  private isAdministrativeRecMed(recMed: {
    recType: RecTypeEnum | null;
    medType: MeasuresTypeEnum | null;
  }): boolean {
    return (
      recMed.recType === RecTypeEnum.ADM ||
      recMed.medType === MeasuresTypeEnum.ADM
    );
  }

  private isEngineeringRecMed(recMed: {
    recType: RecTypeEnum | null;
    medType: MeasuresTypeEnum | null;
  }): boolean {
    return (
      recMed.recType === RecTypeEnum.ENG ||
      recMed.medType === MeasuresTypeEnum.ENG
    );
  }

  private buildEmptyItemStatus(
    analysis?: AiRiskAnalysisResponse | null,
  ): AnalysisItemInventoryStatus {
    const emptyEntry = (): AnalysisItemInventoryEntry => ({
      existsInInventory: false,
      existsInCatalog: false,
    });

    return {
      fontesGeradoras: (analysis?.fontesGeradoras ?? []).map(() => emptyEntry()),
      medidasEngenhariaRecomendadas: (
        analysis?.medidasEngenhariaRecomendadas ?? []
      ).map(() => emptyEntry()),
      medidasAdministrativasRecomendadas: (
        analysis?.medidasAdministrativasRecomendadas ?? []
      ).map(() => emptyEntry()),
    };
  }

  private getRecMedDisplayName(recMed: {
    recName: string | null;
    medName: string | null;
  }): string {
    return recMed.medName?.trim() || recMed.recName?.trim() || '';
  }

  private async resolveActiveRiskFactorDataIdByPair(params: {
    formApplicationId: string;
    accessCompanyId: string;
    pairs: RiskInventoryPair[];
  }): Promise<Map<string, string | null>> {
    const uniquePairs = Array.from(
      new Map(
        params.pairs.map((pair) => [
          this.buildStatusKey(pair.riskId, pair.hierarchyId),
          pair,
        ]),
      ).values(),
    );

    const result = new Map<string, string | null>();
    for (const pair of uniquePairs) {
      result.set(this.buildStatusKey(pair.riskId, pair.hierarchyId), null);
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
        // Setor fora do escopo ou hierarquia inexistente.
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
        id: true,
        riskId: true,
        companyId: true,
        riskFactorGroupDataId: true,
        homogeneousGroupId: true,
        hierarchyId: true,
      },
    });

    for (const row of riskDataRows) {
      const candidateHierarchyIds = new Set<string>();
      if (row.homogeneousGroupId) {
        candidateHierarchyIds.add(row.homogeneousGroupId);
      }
      if (row.hierarchyId) {
        candidateHierarchyIds.add(row.hierarchyId);
      }

      for (const hierarchyId of candidateHierarchyIds) {
        const pairKey = this.buildStatusKey(row.riskId, hierarchyId);
        if (!result.has(pairKey)) continue;

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

        result.set(pairKey, row.id);
      }
    }

    return result;
  }
}
