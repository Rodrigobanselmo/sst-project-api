import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HomoTypeEnum, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { v4 as uuidV4 } from 'uuid';
import {
  emptyOperationalCloneCounts,
  OperationalCloneCounts,
  OperationalCloneMaps,
  OperationalCloneResult,
} from './workspace-operational-data-clone.types';

type CloneParams = {
  tx: Prisma.TransactionClient;
  sourceCompanyId: string;
  sourceWorkspaceId: string;
  targetCompanyId: string;
  targetWorkspaceId: string;
  hierarchyMap: Map<string, string>;
};

/**
 * Clone operacional na conversão workspace → empresa.
 * Regra: nunca restaurar, recriar nem copiar registro soft-deleted; ignorar vínculos cujo alvo está excluído.
 */
@Injectable()
export class WorkspaceOperationalDataCloneService {
  private static readonly activeRecMedWhere = { deleted_at: null } satisfies Prisma.RecMedWhereInput;

  private static readonly activeGenerateSourceWhere = {
    deleted_at: null,
  } satisfies Prisma.GenerateSourceWhereInput;

  private static readonly activeCharacterizationWhere = {
    deleted_at: null,
  } satisfies Prisma.CompanyCharacterizationWhereInput;

  private static readonly activeEnvironmentWhere = {
    deleted_at: null,
  } satisfies Prisma.CompanyEnvironmentWhereInput;

  private static readonly activeCharacterizationPhotoWhere = {
    deleted_at: null,
  } satisfies Prisma.CompanyCharacterizationPhotoWhereInput;

  private static readonly activeEnvironmentPhotoWhere = {
    deleted_at: null,
  } satisfies Prisma.CompanyEnvironmentPhotoWhereInput;

  private static readonly activeEpiWhere = {
    deleted_at: null,
  } satisfies Prisma.EpiWhereInput;

  private static readonly activeExamWhere = {
    deleted_at: null,
  } satisfies Prisma.ExamWhereInput;

  /** Vínculo EPI/engenharia ainda vigente (sem data de encerramento). */
  private static readonly activeRiskLinkEndDateWhere = {
    endDate: null,
  };

  private static readonly activeHierarchyOnHomogeneousWhere = {
    deletedAt: null,
    endDate: null,
  } satisfies Prisma.HierarchyOnHomogeneousWhereInput;

  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: CloneParams): Promise<OperationalCloneResult> {
    const maps = this.createMaps();
    const counts = emptyOperationalCloneCounts();
    const warnings: string[] = [];

    const expected = await this.countExpected(params);

    await this.runStage('stageA (GHO/caracterização/ambiente)', () =>
      this.stageA(params, maps, counts),
    );
    await this.runStage('stageB (riscos/RecMed/GenerateSource)', () =>
      this.stageB(params, maps, counts),
    );
    await this.runStage('stageC (plano de ação/documentos)', () =>
      this.stageC(params, maps, counts, warnings),
    );
    await this.runStage('softDeleteSource', () =>
      this.softDeleteSource(params, maps),
    );

    await this.validateCounts(params, expected, counts);

    return { maps, counts, warnings };
  }

  private createMaps(): OperationalCloneMaps {
    return {
      homogeneousGroupMap: new Map(),
      riskFactorGroupDataMap: new Map(),
      riskFactorDataMap: new Map(),
      recMedMap: new Map(),
      recMedCompanyIdMap: new Map(),
      generateSourceMap: new Map(),
      generateSourceCompanyIdMap: new Map(),
      documentDataMap: new Map(),
      riskFactorDataRecMap: new Map(),
      actionPlanRulesMap: new Map(),
      documentMap: new Map(),
      riskFactorDocumentMap: new Map(),
      systemFileMap: new Map(),
      characterizationPhotoMap: new Map(),
    };
  }

  private async runStage(stage: string, fn: () => Promise<void>) {
    try {
      await fn();
    } catch (error) {
      throw this.wrapCloneStageError(stage, error);
    }
  }

  private wrapCloneStageError(stage: string, error: unknown): Error {
    if (error instanceof BadRequestException) {
      return error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const model =
        typeof error.meta?.modelName === 'string'
          ? error.meta.modelName
          : 'desconhecido';
      const target = Array.isArray(error.meta?.target)
        ? (error.meta.target as string[]).join(', ')
        : String(error.meta?.target ?? 'id');
      if (error.code === 'P2002') {
        return new BadRequestException(
          `Conversão operacional (${stage}): conflito de unicidade em ${model} — campos [${target}]. ` +
            `RecMed/GenerateSource system não podem ser recriados com o mesmo id (PK global).`,
        );
      }
      if (error.code === 'P2003') {
        const field =
          typeof error.meta?.field_name === 'string'
            ? error.meta.field_name
            : 'desconhecido';
        return new BadRequestException(
          `Conversão operacional (${stage}): FK ausente em ${model} — campo ${field}.`,
        );
      }
      return new BadRequestException(
        `Conversão operacional (${stage}): erro Prisma ${error.code} em ${model}.`,
      );
    }
    return error instanceof Error ? error : new Error(String(error));
  }

  private workspaceHomogeneousWhere(
    sourceCompanyId: string,
    sourceWorkspaceId: string,
  ): Prisma.HomogeneousGroupWhereInput {
    return {
      companyId: sourceCompanyId,
      deletedAt: null,
      workspaces: { some: { id: sourceWorkspaceId } },
    };
  }

  /**
   * Medidas/recomendações visíveis no plano de ação do estabelecimento:
   * vínculos RecMedOnRiskData nos RiskFactorData do recorte (mesmo critério da etapa B do clone
   * e do browse do plano por workspace/hierarquia/GHO).
   */
  async countActionPlanMeasuresForPreview(
    sourceCompanyId: string,
    sourceWorkspaceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<number> {
    return tx.recMedOnRiskData.count({
      where: {
        riskData: this.workspaceRiskDataWhere(sourceCompanyId, sourceWorkspaceId),
        recMed: WorkspaceOperationalDataCloneService.activeRecMedWhere,
      },
    });
  }

  /**
   * Medidas derivadas ligadas ao recorte do estabelecimento (workspace direto ou risco do recorte).
   */
  async countDerivedMeasuresForPreview(
    sourceCompanyId: string,
    sourceWorkspaceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<number> {
    return tx.riskFactorDataRecDerivedMeasure.count({
      where: this.activeWorkspaceDerivedMeasureWhere(
        sourceCompanyId,
        sourceWorkspaceId,
      ),
    });
  }

  /** Itens de plano de ação (RiskFactorDataRec) copiáveis — mesmo critério de countExpected/stageC. */
  async countRiskFactorDataRecForPreview(
    sourceCompanyId: string,
    sourceWorkspaceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<number> {
    return tx.riskFactorDataRec.count({
      where: this.activeWorkspaceRiskFactorDataRecWhere(
        sourceCompanyId,
        sourceWorkspaceId,
      ),
    });
  }

  private workspaceRiskDataWhere(
    sourceCompanyId: string,
    sourceWorkspaceId: string,
  ): Prisma.RiskFactorDataWhereInput {
    return {
      companyId: sourceCompanyId,
      deletedAt: null,
      OR: [
        {
          homogeneousGroup: {
            deletedAt: null,
            workspaces: { some: { id: sourceWorkspaceId } },
          },
        },
        {
          hierarchy: {
            deletedAt: null,
            workspaces: { some: { id: sourceWorkspaceId } },
          },
        },
      ],
    };
  }

  /**
   * Itens de plano de ação: apenas RecMed ativo + RiskFactorData ativo no recorte (exclui riscos soft-deleted).
   */
  private activeWorkspaceRiskFactorDataRecWhere(
    sourceCompanyId: string,
    sourceWorkspaceId: string,
  ): Prisma.RiskFactorDataRecWhereInput {
    return {
      companyId: sourceCompanyId,
      recMed: WorkspaceOperationalDataCloneService.activeRecMedWhere,
      riskFactorData: this.workspaceRiskDataWhere(
        sourceCompanyId,
        sourceWorkspaceId,
      ),
    };
  }

  private activeWorkspaceDerivedMeasureWhere(
    sourceCompanyId: string,
    sourceWorkspaceId: string,
  ): Prisma.RiskFactorDataRecDerivedMeasureWhereInput {
    const activeRisk = this.workspaceRiskDataWhere(
      sourceCompanyId,
      sourceWorkspaceId,
    );
    return {
      companyId: sourceCompanyId,
      sourceRecMed: WorkspaceOperationalDataCloneService.activeRecMedWhere,
      derivedRecMed: WorkspaceOperationalDataCloneService.activeRecMedWhere,
      riskFactorData: activeRisk,
      riskFactorDataRec: {
        recMed: WorkspaceOperationalDataCloneService.activeRecMedWhere,
        riskFactorData: activeRisk,
      },
    };
  }

  private addRecMedRef(
    recMedIds: Set<string>,
    originsByRecMedId: Map<string, string[]>,
    recMedId: string | null | undefined,
    origin: string,
  ) {
    if (!recMedId) return;
    recMedIds.add(recMedId);
    const list = originsByRecMedId.get(recMedId) ?? [];
    if (!list.includes(origin)) list.push(origin);
    originsByRecMedId.set(recMedId, list);
  }

  /** Todos os RecMed referenciados pelo recorte operacional do estabelecimento. */
  private async collectWorkspaceRecMedIds(
    params: CloneParams,
    riskDataList: Array<{
      id: string;
      adms: { id: string }[];
      recs: { rec_med_id: string }[];
      engsToRiskFactorData: { recMedId: string }[];
      CharacterizationPhotoRecommendation: { recommendation_id: string }[];
    }>,
  ): Promise<{ recMedIds: Set<string>; originsByRecMedId: Map<string, string[]> }> {
    const recMedIds = new Set<string>();
    const originsByRecMedId = new Map<string, string[]>();
    const { tx, sourceCompanyId, sourceWorkspaceId } = params;
    const riskDataWhere = this.workspaceRiskDataWhere(
      sourceCompanyId,
      sourceWorkspaceId,
    );

    for (const risk of riskDataList) {
      for (const adm of risk.adms) {
        this.addRecMedRef(
          recMedIds,
          originsByRecMedId,
          adm.id,
          `RiskFactorData.adms (riskFactorDataId=${risk.id})`,
        );
      }
      for (const rec of risk.recs) {
        this.addRecMedRef(
          recMedIds,
          originsByRecMedId,
          rec.rec_med_id,
          `RecMedOnRiskData (riskFactorDataId=${risk.id})`,
        );
      }
      for (const eng of risk.engsToRiskFactorData) {
        this.addRecMedRef(
          recMedIds,
          originsByRecMedId,
          eng.recMedId,
          `EngsToRiskFactorData (riskFactorDataId=${risk.id})`,
        );
      }
      for (const photoRec of risk.CharacterizationPhotoRecommendation) {
        this.addRecMedRef(
          recMedIds,
          originsByRecMedId,
          photoRec.recommendation_id,
          `CharacterizationPhotoRecommendation (riskFactorDataId=${risk.id})`,
        );
      }
    }

    const riskDataIds = riskDataList.map((r) => r.id);
    if (riskDataIds.length > 0) {
      const links = await tx.recMedOnRiskData.findMany({
        where: {
          risk_data_id: { in: riskDataIds },
          recMed: WorkspaceOperationalDataCloneService.activeRecMedWhere,
        },
        select: { rec_med_id: true, risk_data_id: true },
      });
      for (const link of links) {
        this.addRecMedRef(
          recMedIds,
          originsByRecMedId,
          link.rec_med_id,
          `RecMedOnRiskData (riskFactorDataId=${link.risk_data_id})`,
        );
      }
    }

    const planRecs = await tx.riskFactorDataRec.findMany({
      where: this.activeWorkspaceRiskFactorDataRecWhere(
        sourceCompanyId,
        sourceWorkspaceId,
      ),
      select: { id: true, recMedId: true, riskFactorDataId: true, workspaceId: true },
    });
    for (const planRec of planRecs) {
      this.addRecMedRef(
        recMedIds,
        originsByRecMedId,
        planRec.recMedId,
        `RiskFactorDataRec (id=${planRec.id}, riskFactorDataId=${planRec.riskFactorDataId}, workspaceId=${planRec.workspaceId})`,
      );
    }

    const derivedRows = await tx.riskFactorDataRecDerivedMeasure.findMany({
      where: this.activeWorkspaceDerivedMeasureWhere(
        sourceCompanyId,
        sourceWorkspaceId,
      ),
      select: {
        id: true,
        sourceRecMedId: true,
        derivedRecMedId: true,
        riskFactorDataId: true,
        riskFactorDataRecId: true,
      },
    });
    for (const row of derivedRows) {
      this.addRecMedRef(
        recMedIds,
        originsByRecMedId,
        row.sourceRecMedId,
        `RiskFactorDataRecDerivedMeasure.source (id=${row.id}, riskFactorDataRecId=${row.riskFactorDataRecId})`,
      );
      this.addRecMedRef(
        recMedIds,
        originsByRecMedId,
        row.derivedRecMedId,
        `RiskFactorDataRecDerivedMeasure.derived (id=${row.id}, riskFactorDataId=${row.riskFactorDataId})`,
      );
    }

    return { recMedIds, originsByRecMedId };
  }

  private async countExpected(params: CloneParams) {
    const { tx, sourceCompanyId, sourceWorkspaceId } = params;
    const [
      homogeneousGroups,
      characterizations,
      environments,
      riskFactorData,
      riskFactorDataRec,
      derivedMeasures,
      actionPlanRules,
      documentData,
      riskFactorDocuments,
      documents,
    ] = await Promise.all([
      tx.homogeneousGroup.count({
        where: this.workspaceHomogeneousWhere(sourceCompanyId, sourceWorkspaceId),
      }),
      tx.companyCharacterization.count({
        where: {
          companyId: sourceCompanyId,
          workspaceId: sourceWorkspaceId,
          deleted_at: null,
        },
      }),
      tx.companyEnvironment.count({
        where: {
          companyId: sourceCompanyId,
          workspaceId: sourceWorkspaceId,
          deleted_at: null,
        },
      }),
      tx.riskFactorData.count({
        where: this.workspaceRiskDataWhere(sourceCompanyId, sourceWorkspaceId),
      }),
      tx.riskFactorDataRec.count({
        where: this.activeWorkspaceRiskFactorDataRecWhere(
          sourceCompanyId,
          sourceWorkspaceId,
        ),
      }),
      tx.riskFactorDataRecDerivedMeasure.count({
        where: this.activeWorkspaceDerivedMeasureWhere(
          sourceCompanyId,
          sourceWorkspaceId,
        ),
      }),
      tx.actionPlanRules.count({
        where: { workspace_id: sourceWorkspaceId, deleted_at: null },
      }),
      tx.documentData.count({
        where: { companyId: sourceCompanyId, workspaceId: sourceWorkspaceId },
      }),
      tx.riskFactorDocument.count({
        where: { companyId: sourceCompanyId, workspaceId: sourceWorkspaceId },
      }),
      tx.document.count({
        where: { companyId: sourceCompanyId, workspaceId: sourceWorkspaceId },
      }),
    ]);

    return {
      homogeneousGroups,
      characterizations,
      environments,
      riskFactorData,
      riskFactorDataRec,
      derivedMeasures,
      actionPlanRules,
      documentData,
      riskFactorDocuments,
      documents,
    };
  }

  private async validateCounts(
    params: CloneParams,
    expected: Awaited<ReturnType<typeof this.countExpected>>,
    copied: OperationalCloneCounts,
  ) {
    const checks: Array<[string, number, number]> = [
      ['homogeneousGroups', expected.homogeneousGroups, copied.homogeneousGroups],
      ['characterizations', expected.characterizations, copied.characterizations],
      ['environments', expected.environments, copied.environments],
      ['riskFactorData', expected.riskFactorData, copied.riskFactorData],
      ['riskFactorDataRec', expected.riskFactorDataRec, copied.riskFactorDataRec],
      ['derivedMeasures', expected.derivedMeasures, copied.derivedMeasures],
      ['actionPlanRules', expected.actionPlanRules, copied.actionPlanRules],
      ['documentData', expected.documentData, copied.documentData],
      ['riskFactorDocuments', expected.riskFactorDocuments, copied.riskFactorDocuments],
      ['documents', expected.documents, copied.documents],
    ];

    const mismatches = checks.filter(([, exp, got]) => exp !== got);
    if (mismatches.length > 0) {
      const detail = mismatches
        .map(([name, exp, got]) => `${name}: esperado ${exp}, copiado ${got}`)
        .join('; ');
      throw new BadRequestException(
        `Contagens da migração operacional divergiram (${detail}). Conversão revertida.`,
      );
    }

    const targetRiskCount = await params.tx.riskFactorData.count({
      where: {
        companyId: params.targetCompanyId,
        deletedAt: null,
        OR: [
          {
            homogeneousGroup: {
              workspaces: { some: { id: params.targetWorkspaceId } },
            },
          },
          {
            hierarchy: {
              workspaces: { some: { id: params.targetWorkspaceId } },
            },
          },
        ],
      },
    });

    if (targetRiskCount !== expected.riskFactorData) {
      throw new BadRequestException(
        `Validação pós-cópia de riscos falhou: destino ${targetRiskCount}, origem ${expected.riskFactorData}.`,
      );
    }
  }

  private resolveNewHomogeneousId(
    group: { id: string; type: HomoTypeEnum | null },
    hierarchyMap: Map<string, string>,
  ) {
    if (group.type === HomoTypeEnum.HIERARCHY) {
      const mapped = hierarchyMap.get(group.id);
      if (!mapped) {
        throw new BadRequestException(
          `GHO hierárquico ${group.id} sem mapeamento de hierarquia`,
        );
      }
      return mapped;
    }
    return uuidV4();
  }

  private async stageA(
    params: CloneParams,
    maps: OperationalCloneMaps,
    counts: OperationalCloneCounts,
  ) {
    const homoGroups = await params.tx.homogeneousGroup.findMany({
      where: this.workspaceHomogeneousWhere(
        params.sourceCompanyId,
        params.sourceWorkspaceId,
      ),
      include: {
        characterization: {
          where: WorkspaceOperationalDataCloneService.activeCharacterizationWhere,
          include: {
            photos: {
              where:
                WorkspaceOperationalDataCloneService.activeCharacterizationPhotoWhere,
            },
            profiles: true,
          },
        },
        environment: {
          where: WorkspaceOperationalDataCloneService.activeEnvironmentWhere,
          include: {
            photos: {
              where: WorkspaceOperationalDataCloneService.activeEnvironmentPhotoWhere,
            },
          },
        },
        hierarchyOnHomogeneous: {
          where: WorkspaceOperationalDataCloneService.activeHierarchyOnHomogeneousWhere,
        },
      },
    });

    const roots = homoGroups.filter(
      (g) =>
        !g.characterization?.profileParentId && !g.environment?.parentEnvironmentId,
    );
    const children = homoGroups.filter(
      (g) =>
        g.characterization?.profileParentId || g.environment?.parentEnvironmentId,
    );

    const copyOne = async (group: (typeof homoGroups)[0]) => {
      if (maps.homogeneousGroupMap.has(group.id)) return;

      const newHomoId = this.resolveNewHomogeneousId(
        group,
        params.hierarchyMap,
      );
      maps.homogeneousGroupMap.set(group.id, newHomoId);

      await params.tx.homogeneousGroup.create({
        data: {
          id: newHomoId,
          name: newHomoId,
          description: group.description,
          companyId: params.targetCompanyId,
          type: group.type,
          status: group.status,
          workspaces: {
            connect: {
              id_companyId: {
                id: params.targetWorkspaceId,
                companyId: params.targetCompanyId,
              },
            },
          },
        },
      });
      counts.homogeneousGroups += 1;

      if (group.characterization) {
        const mappedProfileParent = group.characterization.profileParentId
          ? maps.homogeneousGroupMap.get(group.characterization.profileParentId)
          : undefined;

        await params.tx.companyCharacterization.create({
          data: {
            id: newHomoId,
            name: group.characterization.name,
            description: group.characterization.description,
            type: group.characterization.type,
            activities: group.characterization.activities,
            paragraphs: group.characterization.paragraphs,
            considerations: group.characterization.considerations,
            luminosity: group.characterization.luminosity,
            moisturePercentage: group.characterization.moisturePercentage,
            noiseValue: group.characterization.noiseValue,
            temperature: group.characterization.temperature,
            profileName: group.characterization.profileName,
            profileParentId: mappedProfileParent,
            order: group.characterization.order,
            stageId: group.characterization.stageId,
            status: group.characterization.status,
            companyId: params.targetCompanyId,
            workspaceId: params.targetWorkspaceId,
          },
        });
        counts.characterizations += 1;

        for (const photo of group.characterization.photos) {
          const newPhoto = await params.tx.companyCharacterizationPhoto.create({
            data: {
              name: photo.name,
              isVertical: photo.isVertical,
              photoUrl: photo.photoUrl,
              order: photo.order,
              companyCharacterizationId: newHomoId,
            },
          });
          maps.characterizationPhotoMap.set(photo.id, newPhoto.id);
        }
      }

      if (group.environment) {
        const mappedParent = group.environment.parentEnvironmentId
          ? maps.homogeneousGroupMap.get(group.environment.parentEnvironmentId)
          : undefined;

        await params.tx.companyEnvironment.create({
          data: {
            id: newHomoId,
            name: group.environment.name,
            description: group.environment.description,
            type: group.environment.type,
            activities: group.environment.activities,
            paragraphs: group.environment.paragraphs,
            considerations: group.environment.considerations,
            luminosity: group.environment.luminosity,
            moisturePercentage: group.environment.moisturePercentage,
            noiseValue: group.environment.noiseValue,
            temperature: group.environment.temperature,
            order: group.environment.order,
            parentEnvironmentId: mappedParent,
            companyId: params.targetCompanyId,
            workspaceId: params.targetWorkspaceId,
          },
        });
        counts.environments += 1;

        for (const photo of group.environment.photos) {
          await params.tx.companyEnvironmentPhoto.create({
            data: {
              name: photo.name,
              photoUrl: photo.photoUrl,
              isVertical: photo.isVertical,
              order: photo.order,
              companyEnvironmentId: newHomoId,
            },
          });
        }
      }

      for (const link of group.hierarchyOnHomogeneous) {
        const mappedHierarchyId = params.hierarchyMap.get(link.hierarchyId);
        if (!mappedHierarchyId) {
          throw new BadRequestException(
            `HierarchyOnHomogeneous ${link.id} sem hierarchyMap`,
          );
        }
        await params.tx.hierarchyOnHomogeneous.create({
          data: {
            hierarchyId: mappedHierarchyId,
            homogeneousGroupId: newHomoId,
            startDate: link.startDate,
            endDate: link.endDate,
          },
        });
      }
    };

    for (const group of roots) {
      await copyOne(group);
    }

    let pending = [...children];
    let guard = 0;
    while (pending.length > 0 && guard < 50) {
      guard += 1;
      const next: typeof children = [];
      for (const group of pending) {
        const parentId =
          group.characterization?.profileParentId ||
          group.environment?.parentEnvironmentId;
        if (parentId && !maps.homogeneousGroupMap.has(parentId)) {
          next.push(group);
          continue;
        }
        await copyOne(group);
      }
      pending = next;
    }

    if (pending.length > 0) {
      throw new BadRequestException(
        'Não foi possível copiar todos os GHO/perfis/ambientes filhos (dependência circular ou pai ausente)',
      );
    }
  }

  /**
   * Garante GenerateSource copiável/conectável. Retorna null se soft-deleted (vínculo ignorado).
   */
  private async ensureGenerateSource(
    params: CloneParams,
    maps: OperationalCloneMaps,
    counts: OperationalCloneCounts,
    sourceId: string,
  ): Promise<string | null> {
    if (maps.generateSourceMap.has(sourceId)) {
      return maps.generateSourceMap.get(sourceId)!;
    }

    const source = await params.tx.generateSource.findFirst({
      where: { id: sourceId },
    });
    if (!source) {
      throw new BadRequestException(
        `GenerateSource ${sourceId} não existe no banco. Etapa: stageB (dependência de RecMed).`,
      );
    }
    if (source.deleted_at) {
      return null;
    }
    if (source.system) {
      maps.generateSourceMap.set(sourceId, sourceId);
      maps.generateSourceCompanyIdMap.set(sourceId, source.companyId);
      return sourceId;
    }

    const newId = uuidV4();
    await params.tx.generateSource.create({
      data: {
        id: newId,
        riskId: source.riskId,
        name: source.name,
        companyId: params.targetCompanyId,
        system: false,
        status: source.status,
      },
    });
    maps.generateSourceMap.set(sourceId, newId);
    maps.generateSourceCompanyIdMap.set(sourceId, params.targetCompanyId);
    counts.generateSources += 1;
    return newId;
  }

  /**
   * Garante RecMed copiável/conectável. Retorna null se soft-deleted (vínculo ignorado).
   */
  private async ensureRecMed(
    params: CloneParams,
    maps: OperationalCloneMaps,
    counts: OperationalCloneCounts,
    sourceId: string,
    origins: string[] = [],
  ): Promise<string | null> {
    if (!sourceId) {
      const refs = origins.length ? origins.join('; ') : 'não rastreado';
      throw new BadRequestException(
        `RecMed id vazio. Referências: ${refs}. Etapa: stageB (pré-cópia de RecMed).`,
      );
    }
    if (maps.recMedMap.has(sourceId)) {
      return maps.recMedMap.get(sourceId)!;
    }

    const source = await params.tx.recMed.findFirst({
      where: { id: sourceId },
    });
    if (!source) {
      const refs = origins.length ? origins.join('; ') : 'não rastreado';
      throw new BadRequestException(
        `RecMed ${sourceId} não existe no banco. Referências: ${refs}. Etapa: stageB (pré-cópia de RecMed).`,
      );
    }
    if (source.deleted_at) {
      return null;
    }

    if (source.system) {
      if (source.generateSourceId) {
        await this.ensureGenerateSource(
          params,
          maps,
          counts,
          source.generateSourceId,
        );
      }
      maps.recMedMap.set(sourceId, sourceId);
      maps.recMedCompanyIdMap.set(sourceId, source.companyId);
      return sourceId;
    }

    let generateSourceId: string | undefined;
    if (source.generateSourceId) {
      const mappedGs = await this.ensureGenerateSource(
        params,
        maps,
        counts,
        source.generateSourceId,
      );
      if (mappedGs) {
        generateSourceId = mappedGs;
      }
    }

    const newId = uuidV4();
    await params.tx.recMed.create({
      data: {
        id: newId,
        riskId: source.riskId,
        recName: source.recName,
        medName: source.medName,
        companyId: params.targetCompanyId,
        generateSourceId,
        system: false,
        medType: source.medType,
        status: source.status,
        recType: source.recType,
      },
    });
    maps.recMedMap.set(sourceId, newId);
    maps.recMedCompanyIdMap.set(sourceId, params.targetCompanyId);
    counts.recMed += 1;
    return newId;
  }

  private recMedConnectKey(
    maps: OperationalCloneMaps,
    sourceRecMedId: string,
  ): { id: string; companyId: string } {
    const id = maps.recMedMap.get(sourceRecMedId);
    const companyId = maps.recMedCompanyIdMap.get(sourceRecMedId);
    if (!id || !companyId) {
      throw new BadRequestException(
        `RecMed ${sourceRecMedId} sem mapeamento de connect (id/companyId). Etapa: stageB.`,
      );
    }
    return { id, companyId };
  }

  private generateSourceConnectKey(
    maps: OperationalCloneMaps,
    sourceGenerateSourceId: string,
  ): { id: string; companyId: string } {
    const id = maps.generateSourceMap.get(sourceGenerateSourceId);
    const companyId = maps.generateSourceCompanyIdMap.get(sourceGenerateSourceId);
    if (!id || !companyId) {
      throw new BadRequestException(
        `GenerateSource ${sourceGenerateSourceId} sem mapeamento de connect (id/companyId). Etapa: stageB.`,
      );
    }
    return { id, companyId };
  }

  private async stageB(
    params: CloneParams,
    maps: OperationalCloneMaps,
    counts: OperationalCloneCounts,
  ) {
    const riskDataList = await params.tx.riskFactorData.findMany({
      where: this.workspaceRiskDataWhere(
        params.sourceCompanyId,
        params.sourceWorkspaceId,
      ),
      include: {
        generateSources: {
          where: WorkspaceOperationalDataCloneService.activeGenerateSourceWhere,
        },
        adms: { where: WorkspaceOperationalDataCloneService.activeRecMedWhere },
        recs: {
          where: { recMed: WorkspaceOperationalDataCloneService.activeRecMedWhere },
        },
        epiToRiskFactorData: {
          where: {
            ...WorkspaceOperationalDataCloneService.activeRiskLinkEndDateWhere,
            epi: WorkspaceOperationalDataCloneService.activeEpiWhere,
          },
        },
        engsToRiskFactorData: {
          where: {
            ...WorkspaceOperationalDataCloneService.activeRiskLinkEndDateWhere,
            recMed: WorkspaceOperationalDataCloneService.activeRecMedWhere,
          },
        },
        examsToRiskFactorData: {
          where: { exam: WorkspaceOperationalDataCloneService.activeExamWhere },
        },
        probabilityCalc: true,
        probabilityAfterCalc: true,
        CharacterizationPhotoRecommendation: {
          where: {
            recommendation: WorkspaceOperationalDataCloneService.activeRecMedWhere,
            photo: WorkspaceOperationalDataCloneService.activeCharacterizationPhotoWhere,
          },
        },
      },
    });

    const groupIds = [
      ...new Set(riskDataList.map((r) => r.riskFactorGroupDataId)),
    ];

    for (const groupId of groupIds) {
      const sourceGroup = await params.tx.riskFactorGroupData.findFirst({
        where: { id: groupId, companyId: params.sourceCompanyId },
      });
      if (!sourceGroup) continue;

      const newGroupId = uuidV4();
      await params.tx.riskFactorGroupData.create({
        data: {
          id: newGroupId,
          name: sourceGroup.name,
          companyId: params.targetCompanyId,
        },
      });
      maps.riskFactorGroupDataMap.set(groupId, newGroupId);
      counts.riskFactorGroupData += 1;
    }

    const { recMedIds, originsByRecMedId } = await this.collectWorkspaceRecMedIds(
      params,
      riskDataList,
    );
    for (const recMedId of recMedIds) {
      await this.ensureRecMed(
        params,
        maps,
        counts,
        recMedId,
        originsByRecMedId.get(recMedId) ?? [],
      );
    }

    const generateSourceIds = new Set<string>();
    for (const risk of riskDataList) {
      risk.generateSources.forEach((g) => generateSourceIds.add(g.id));
    }
    for (const gsId of generateSourceIds) {
      await this.ensureGenerateSource(params, maps, counts, gsId);
    }

    const generateSourceConnects = (risk: (typeof riskDataList)[number]) =>
      risk.generateSources
        .filter((g) => maps.generateSourceMap.has(g.id))
        .map((g) => ({
          id_companyId: this.generateSourceConnectKey(maps, g.id),
        }));

    const recMedConnects = (risk: (typeof riskDataList)[number]) =>
      risk.adms
        .filter((a) => maps.recMedMap.has(a.id))
        .map((a) => ({
          id_companyId: this.recMedConnectKey(maps, a.id),
        }));

    const recMedOnRiskCreates = (risk: (typeof riskDataList)[number]) =>
      risk.recs
        .map((r) => {
          const mappedRecMedId = maps.recMedMap.get(r.rec_med_id);
          if (!mappedRecMedId) return null;
          return {
            rec_med_id: mappedRecMedId,
            sequential_id: r.sequential_id,
          };
        })
        .filter(Boolean) as { rec_med_id: string; sequential_id: number | null }[];

    const engCreates = (risk: (typeof riskDataList)[number]) =>
      risk.engsToRiskFactorData
        .map((row) => {
          const mappedRecMedId = maps.recMedMap.get(row.recMedId);
          if (!mappedRecMedId) return null;
          return {
            recMedId: mappedRecMedId,
            efficientlyCheck: row.efficientlyCheck,
            endDate: row.endDate,
            startDate: row.startDate,
          };
        })
        .filter(Boolean) as {
        recMedId: string;
        efficientlyCheck: boolean | null;
        endDate: Date | null;
        startDate: Date | null;
      }[];

    for (const risk of riskDataList) {
      const newRiskId = uuidV4();
      const newGroupId = maps.riskFactorGroupDataMap.get(
        risk.riskFactorGroupDataId,
      );
      if (!newGroupId) {
        throw new BadRequestException(
          `RiskFactorGroupData ${risk.riskFactorGroupDataId} não mapeado`,
        );
      }

      const mappedHomo = risk.homogeneousGroupId
        ? maps.homogeneousGroupMap.get(risk.homogeneousGroupId)
        : undefined;
      const mappedHierarchy = risk.hierarchyId
        ? params.hierarchyMap.get(risk.hierarchyId)
        : undefined;

      if (risk.homogeneousGroupId && !mappedHomo) {
        throw new BadRequestException(
          `homogeneousGroupId ${risk.homogeneousGroupId} não mapeado`,
        );
      }
      if (risk.hierarchyId && !mappedHierarchy) {
        throw new BadRequestException(
          `hierarchyId ${risk.hierarchyId} não mapeado`,
        );
      }

      const gsConnects = generateSourceConnects(risk);
      const admConnects = recMedConnects(risk);
      const recCreates = recMedOnRiskCreates(risk);

      await params.tx.riskFactorData.create({
        data: {
          id: newRiskId,
          companyId: params.targetCompanyId,
          riskId: risk.riskId,
          riskFactorGroupDataId: newGroupId,
          homogeneousGroupId: mappedHomo,
          hierarchyId: mappedHierarchy,
          probability: risk.probability,
          probabilityAfter: risk.probabilityAfter,
          exposure: risk.exposure,
          json: risk.json ?? undefined,
          activities: risk.activities ?? undefined,
          level: risk.level,
          standardExams: risk.standardExams,
          startDate: risk.startDate,
          endDate: risk.endDate,
          generateSources: gsConnects.length
            ? { connect: gsConnects }
            : undefined,
          adms: admConnects.length ? { connect: admConnects } : undefined,
          recs: recCreates.length ? { create: recCreates } : undefined,
        },
      });

      maps.riskFactorDataMap.set(risk.id, newRiskId);
      counts.riskFactorData += 1;

      if (risk.probabilityCalc) {
        await params.tx.riskFactorProbability.create({
          data: {
            id: uuidV4(),
            intensity: risk.probabilityCalc.intensity,
            intensityResult: risk.probabilityCalc.intensityResult,
            intensityLt: risk.probabilityCalc.intensityLt,
            minDurationJT: risk.probabilityCalc.minDurationJT,
            minDurationEO: risk.probabilityCalc.minDurationEO,
            chancesOfHappening: risk.probabilityCalc.chancesOfHappening,
            frequency: risk.probabilityCalc.frequency,
            history: risk.probabilityCalc.history,
            medsImplemented: risk.probabilityCalc.medsImplemented,
            riskId: risk.riskId,
            riskFactorGroupDataId: newGroupId,
            riskFactorDataId: newRiskId,
          },
        });
      }

      if (risk.probabilityAfterCalc) {
        await params.tx.riskFactorProbability.create({
          data: {
            id: uuidV4(),
            intensity: risk.probabilityAfterCalc.intensity,
            intensityResult: risk.probabilityAfterCalc.intensityResult,
            intensityLt: risk.probabilityAfterCalc.intensityLt,
            minDurationJT: risk.probabilityAfterCalc.minDurationJT,
            minDurationEO: risk.probabilityAfterCalc.minDurationEO,
            chancesOfHappening: risk.probabilityAfterCalc.chancesOfHappening,
            frequency: risk.probabilityAfterCalc.frequency,
            history: risk.probabilityAfterCalc.history,
            medsImplemented: risk.probabilityAfterCalc.medsImplemented,
            riskId: risk.riskId,
            riskFactorGroupDataId: newGroupId,
            riskFactorDataAfterId: newRiskId,
          },
        });
      }

      const epiRows = risk.epiToRiskFactorData;
      if (epiRows.length) {
        await params.tx.epiToRiskFactorData.createMany({
          data: epiRows.map((row) => ({
            epiId: row.epiId,
            riskFactorDataId: newRiskId,
            efficientlyCheck: row.efficientlyCheck,
            epcCheck: row.epcCheck,
            lifeTimeInDays: row.lifeTimeInDays,
            longPeriodsCheck: row.longPeriodsCheck,
            maintenanceCheck: row.maintenanceCheck,
            sanitationCheck: row.sanitationCheck,
            tradeSignCheck: row.tradeSignCheck,
            trainingCheck: row.trainingCheck,
            unstoppedCheck: row.unstoppedCheck,
            validationCheck: row.validationCheck,
            endDate: row.endDate,
            startDate: row.startDate,
          })),
        });
      }

      const engRows = engCreates(risk).map((row) => ({
        ...row,
        riskFactorDataId: newRiskId,
      }));
      if (engRows.length) {
        await params.tx.engsToRiskFactorData.createMany({ data: engRows });
      }

      if (risk.examsToRiskFactorData.length) {
        await params.tx.examToRiskData.createMany({
          data: risk.examsToRiskFactorData.map((row) => ({
            examId: row.examId,
            riskFactorDataId: newRiskId,
            fromAge: row.fromAge,
            isAdmission: row.isAdmission,
            isChange: row.isChange,
            isDismissal: row.isDismissal,
            isFemale: row.isFemale,
            isMale: row.isMale,
            isPeriodic: row.isPeriodic,
            isReturn: row.isReturn,
            toAge: row.toAge,
            validityInMonths: row.validityInMonths,
            lowValidityInMonths: row.lowValidityInMonths,
            considerBetweenDays: row.considerBetweenDays,
          })),
        });
      }

      for (const rec of risk.CharacterizationPhotoRecommendation) {
        const mappedPhoto = maps.characterizationPhotoMap.get(rec.photo_id);
        const mappedRec = maps.recMedMap.get(rec.recommendation_id);
        if (!mappedPhoto) {
          throw new BadRequestException(
            `CharacterizationPhotoRecommendation (riskFactorDataId=${newRiskId}, photo_id=${rec.photo_id}): foto não mapeada. Etapa: stageB.`,
          );
        }
        if (!mappedRec) {
          continue;
        }

        await params.tx.characterizationPhotoRecommendation.create({
          data: {
            risk_data_id: newRiskId,
            recommendation_id: mappedRec,
            photo_id: mappedPhoto,
            is_visible: rec.is_visible,
          },
        });
        counts.characterizationPhotoRecommendations += 1;
      }
    }

    const riskIds = [...new Set(riskDataList.map((r) => r.riskId))];
    const examToRisks = await params.tx.examToRisk.findMany({
      where: {
        companyId: params.sourceCompanyId,
        deletedAt: null,
        riskId: { in: riskIds },
      },
    });

    for (const exam of examToRisks) {
      await params.tx.examToRisk.create({
        data: {
          examId: exam.examId,
          riskId: exam.riskId,
          companyId: params.targetCompanyId,
          fromAge: exam.fromAge,
          isAdmission: exam.isAdmission,
          isChange: exam.isChange,
          isDismissal: exam.isDismissal,
          isFemale: exam.isFemale,
          isMale: exam.isMale,
          isPeriodic: exam.isPeriodic,
          isReturn: exam.isReturn,
          startDate: exam.startDate,
          toAge: exam.toAge,
          validityInMonths: exam.validityInMonths,
          lowValidityInMonths: exam.lowValidityInMonths,
          minRiskDegree: exam.minRiskDegree,
          minRiskDegreeQuantity: exam.minRiskDegreeQuantity,
          considerBetweenDays: exam.considerBetweenDays,
        },
      });
    }

    for (const risk of riskDataList) {
      await params.tx.riskFactorData.update({
        where: { id: risk.id },
        data: { deletedAt: new Date() },
      });
    }
  }

  private remapJsonValue(
    value: unknown,
    idMaps: Map<string, string>[],
    warnings: string[],
  ): unknown {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      for (const map of idMaps) {
        if (map.has(value)) return map.get(value);
      }
      if (/^[0-9a-f-]{36}$/i.test(value)) {
        const inAnySource = idMaps.some((m) =>
          [...m.keys()].includes(value),
        );
        if (inAnySource) {
          warnings.push(
            `DocumentData.json: id ${value} referenciado mas sem mapeamento seguro`,
          );
        }
      }
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.remapJsonValue(item, idMaps, warnings));
    }
    if (typeof value === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        result[key] = this.remapJsonValue(val, idMaps, warnings);
      }
      return result;
    }
    return value;
  }

  private async stageC(
    params: CloneParams,
    maps: OperationalCloneMaps,
    counts: OperationalCloneCounts,
    warnings: string[],
  ) {
    const recs = await params.tx.riskFactorDataRec.findMany({
      where: this.activeWorkspaceRiskFactorDataRecWhere(
        params.sourceCompanyId,
        params.sourceWorkspaceId,
      ),
      include: {
        comments: true,
        photos: {
          where: { deleted_at: null },
          include: { file: true },
        },
        derivedMeasure: true,
      },
    });

    for (const rec of recs) {
      const mappedRiskId = maps.riskFactorDataMap.get(rec.riskFactorDataId);
      const mappedRecMedId = maps.recMedMap.get(rec.recMedId);
      if (!mappedRiskId || !mappedRecMedId) {
        continue;
      }

      const newRecId = uuidV4();
      await params.tx.riskFactorDataRec.create({
        data: {
          id: newRecId,
          companyId: params.targetCompanyId,
          workspaceId: params.targetWorkspaceId,
          recMedId: mappedRecMedId,
          riskFactorDataId: mappedRiskId,
          responsibleName: rec.responsibleName,
          endDate: rec.endDate,
          status: rec.status,
          startDate: rec.startDate,
          doneDate: rec.doneDate,
          canceledDate: rec.canceledDate,
          responsibleId: rec.responsibleId,
          responsible_updated_at: rec.responsible_updated_at,
          responsible_notified_at: rec.responsible_notified_at,
        },
      });
      maps.riskFactorDataRecMap.set(rec.id, newRecId);
      counts.riskFactorDataRec += 1;

      if (rec.comments.length) {
        await params.tx.riskFactorDataRecComments.createMany({
          data: rec.comments.map((c) => ({
            text: c.text,
            type: c.type,
            riskFactorDataRecId: newRecId,
            textType: c.textType,
            previous_status: c.previous_status,
            current_status: c.current_status,
            previous_valid_date: c.previous_valid_date,
            current_valid_date: c.current_valid_date,
            isApproved: c.isApproved,
            approvedAt: c.approvedAt,
            approvedComment: c.approvedComment,
            approvedById: c.approvedById,
            userId: c.userId,
          })),
        });
      }

      for (const photo of rec.photos) {
        let fileId = maps.systemFileMap.get(photo.file_id);
        if (!fileId) {
          const newFileId = uuidV4();
          await params.tx.systemFile.create({
            data: {
              id: newFileId,
              url: photo.file.url,
              key: photo.file.key,
              bucket: photo.file.bucket,
              name: photo.file.name,
              size: photo.file.size,
              should_delete: false,
              metadata: photo.file.metadata ?? undefined,
              company_id: params.targetCompanyId,
            },
          });
          maps.systemFileMap.set(photo.file_id, newFileId);
          fileId = newFileId;
        }

        await params.tx.riskFactorDataRecPhoto.create({
          data: {
            is_vertical: photo.is_vertical,
            file_id: fileId,
            risk_data_rec_id: newRecId,
          },
        });
      }

      if (rec.derivedMeasure) {
        const dm = rec.derivedMeasure;
        const mappedSourceRecMedId = maps.recMedMap.get(dm.sourceRecMedId);
        const mappedDerivedRecMedId = maps.recMedMap.get(dm.derivedRecMedId);
        if (!mappedSourceRecMedId || !mappedDerivedRecMedId) {
          continue;
        }
        await params.tx.riskFactorDataRecDerivedMeasure.create({
          data: {
            riskFactorDataRecId: newRecId,
            sourceRecMedId: mappedSourceRecMedId,
            derivedRecMedId: mappedDerivedRecMedId,
            riskFactorDataId: mappedRiskId,
            workspaceId: params.targetWorkspaceId,
            companyId: params.targetCompanyId,
            destinationMedType: dm.destinationMedType,
            sourceRecType: dm.sourceRecType,
          },
        });
        counts.derivedMeasures += 1;
      }
    }

    const rules = await params.tx.actionPlanRules.findMany({
      where: {
        workspace_id: params.sourceWorkspaceId,
        deleted_at: null,
      },
      include: {
        hierarchies: true,
        users: true,
        riskSubTypes: true,
      },
    });

    for (const rule of rules) {
      const newRule = await params.tx.actionPlanRules.create({
        data: {
          is_restriction: rule.is_restriction,
          is_all_hierarchies: rule.is_all_hierarchies,
          risk_types: rule.risk_types,
          workspace_id: params.targetWorkspaceId,
        },
      });
      maps.actionPlanRulesMap.set(rule.id, newRule.id);
      counts.actionPlanRules += 1;

      if (rule.hierarchies.length) {
        await params.tx.actionPlanRulesOnHierarchy.createMany({
          data: rule.hierarchies
            .map((h) => {
              const hierarchyId = params.hierarchyMap.get(h.hierarchy_id);
              if (!hierarchyId) return null;
              return {
                action_plan_rules_id: newRule.id,
                hierarchy_id: hierarchyId,
              };
            })
            .filter(Boolean) as { action_plan_rules_id: number; hierarchy_id: string }[],
        });
      }

      if (rule.users.length) {
        await params.tx.actionPlanRulesOnUsers.createMany({
          data: rule.users.map((u) => ({
            action_plan_rules_id: newRule.id,
            user_id: u.user_id,
          })),
        });
      }

      if (rule.riskSubTypes.length) {
        await params.tx.actionPlanRulesOnRiskSubType.createMany({
          data: rule.riskSubTypes.map((r) => ({
            action_plan_rules_id: newRule.id,
            risk_sub_type_id: r.risk_sub_type_id,
          })),
        });
      }
    }

    const idMapsForJson = [
      maps.homogeneousGroupMap,
      maps.riskFactorDataMap,
      maps.riskFactorGroupDataMap,
      maps.recMedMap,
      maps.generateSourceMap,
      maps.documentDataMap,
      params.hierarchyMap,
    ];

    const documentDataRows = await params.tx.documentData.findMany({
      where: {
        companyId: params.sourceCompanyId,
        workspaceId: params.sourceWorkspaceId,
      },
      include: {
        professionalsSignatures: true,
        docs: true,
      },
    });

    for (const doc of documentDataRows) {
      const newDocId = uuidV4();
      const remappedJson = doc.json
        ? this.remapJsonValue(doc.json, idMapsForJson, warnings)
        : undefined;

      await params.tx.documentData.create({
        data: {
          id: newDocId,
          name: doc.name,
          companyId: params.targetCompanyId,
          workspaceId: params.targetWorkspaceId,
          validityStart: doc.validityStart,
          validityEnd: doc.validityEnd,
          status: doc.status,
          type: doc.type,
          modelId: doc.modelId,
          elaboratedBy: doc.elaboratedBy,
          coordinatorBy: doc.coordinatorBy,
          revisionBy: doc.revisionBy,
          approvedBy: doc.approvedBy,
          months_period_level_2: doc.months_period_level_2,
          months_period_level_3: doc.months_period_level_3,
          months_period_level_4: doc.months_period_level_4,
          months_period_level_5: doc.months_period_level_5,
          json: remappedJson as Prisma.InputJsonValue | undefined,
          coordinatorId: doc.coordinatorId,
        },
      });
      maps.documentDataMap.set(doc.id, newDocId);
      counts.documentData += 1;

      if (doc.professionalsSignatures.length) {
        await params.tx.documentDataToProfessional.createMany({
          data: doc.professionalsSignatures.map((p) => ({
            documentDataId: newDocId,
            professionalId: p.professionalId,
            isSigner: p.isSigner,
            isElaborator: p.isElaborator,
          })),
        });
      }

      for (const riskDoc of doc.docs) {
        const newRiskDocId = uuidV4();
        await params.tx.riskFactorDocument.create({
          data: {
            id: newRiskDocId,
            fileUrl: riskDoc.fileUrl,
            name: riskDoc.name,
            description: riskDoc.description,
            version: riskDoc.version,
            companyId: params.targetCompanyId,
            workspaceName: riskDoc.workspaceName,
            workspaceId: params.targetWorkspaceId,
            status: riskDoc.status,
            documentDataId: newDocId,
            approvedBy: riskDoc.approvedBy,
            elaboratedBy: riskDoc.elaboratedBy,
            revisionBy: riskDoc.revisionBy,
            validity: riskDoc.validity,
          },
        });
        maps.riskFactorDocumentMap.set(riskDoc.id, newRiskDocId);
        counts.riskFactorDocuments += 1;
      }
    }

    const documents = await params.tx.document.findMany({
      where: {
        companyId: params.sourceCompanyId,
        workspaceId: params.sourceWorkspaceId,
      },
      orderBy: { parentDocumentId: 'asc' },
    });

    const roots = documents.filter((d) => !d.parentDocumentId);
    const children = documents.filter((d) => d.parentDocumentId);

    const copyDocument = async (doc: (typeof documents)[0]) => {
      if (maps.documentMap.has(doc.id)) return;

      const mappedParent = doc.parentDocumentId
        ? maps.documentMap.get(doc.parentDocumentId)
        : undefined;

      const created = await params.tx.document.create({
        data: {
          fileUrl: doc.fileUrl,
          name: doc.name,
          description: doc.description,
          startDate: doc.startDate,
          endDate: doc.endDate,
          type: doc.type,
          status: doc.status,
          companyId: params.targetCompanyId,
          workspaceId: params.targetWorkspaceId,
          parentDocumentId: mappedParent,
        },
      });
      maps.documentMap.set(doc.id, created.id);
      counts.documents += 1;
    };

    for (const doc of roots) {
      await copyDocument(doc);
    }

    let pendingDocs = [...children];
    let guard = 0;
    while (pendingDocs.length > 0 && guard < 50) {
      guard += 1;
      const next: typeof children = [];
      for (const doc of pendingDocs) {
        if (doc.parentDocumentId && !maps.documentMap.has(doc.parentDocumentId)) {
          next.push(doc);
          continue;
        }
        await copyDocument(doc);
      }
      pendingDocs = next;
    }

    const orphanRiskDocs = await params.tx.riskFactorDocument.findMany({
      where: {
        companyId: params.sourceCompanyId,
        workspaceId: params.sourceWorkspaceId,
        id: { notIn: [...maps.riskFactorDocumentMap.keys()] },
      },
    });

    for (const riskDoc of orphanRiskDocs) {
      const mappedDocumentDataId = maps.documentDataMap.get(
        riskDoc.documentDataId,
      );
      if (!mappedDocumentDataId) {
        warnings.push(
          `RiskFactorDocument ${riskDoc.id} sem DocumentData mapeado; documento não copiado`,
        );
        continue;
      }

      const newRiskDocId = uuidV4();
      await params.tx.riskFactorDocument.create({
        data: {
          id: newRiskDocId,
          fileUrl: riskDoc.fileUrl,
          name: riskDoc.name,
          description: riskDoc.description,
          version: riskDoc.version,
          companyId: params.targetCompanyId,
          workspaceName: riskDoc.workspaceName,
          workspaceId: params.targetWorkspaceId,
          status: riskDoc.status,
          documentDataId: mappedDocumentDataId,
          approvedBy: riskDoc.approvedBy,
          elaboratedBy: riskDoc.elaboratedBy,
          revisionBy: riskDoc.revisionBy,
          validity: riskDoc.validity,
        },
      });
      maps.riskFactorDocumentMap.set(riskDoc.id, newRiskDocId);
      counts.riskFactorDocuments += 1;
    }
  }

  private async softDeleteSource(
    params: CloneParams,
    maps: OperationalCloneMaps,
  ) {
    for (const oldHomoId of maps.homogeneousGroupMap.keys()) {
      const homo = await params.tx.homogeneousGroup.findFirst({
        where: { id: oldHomoId },
        include: { workspaces: { select: { id: true } } },
      });
      if (!homo) continue;

      const onlySource =
        homo.workspaces.length === 1 &&
        homo.workspaces[0].id === params.sourceWorkspaceId;

      if (onlySource) {
        await params.tx.homogeneousGroup.update({
          where: { id: oldHomoId },
          data: { deletedAt: new Date() },
        });
        await params.tx.companyCharacterization.updateMany({
          where: { id: oldHomoId },
          data: { deleted_at: new Date() },
        });
        await params.tx.companyEnvironment.updateMany({
          where: { id: oldHomoId },
          data: { deleted_at: new Date() },
        });
      } else {
        await params.tx.homogeneousGroup.update({
          where: { id: oldHomoId },
          data: {
            workspaces: {
              disconnect: {
                id_companyId: {
                  id: params.sourceWorkspaceId,
                  companyId: params.sourceCompanyId,
                },
              },
            },
          },
        });
      }
    }

    await params.tx.hierarchyOnHomogeneous.updateMany({
      where: {
        homogeneousGroupId: { in: [...maps.homogeneousGroupMap.keys()] },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  async listCompanyGroupsForSourceCompany(sourceCompanyId: string) {
    return this.prisma.companyGroup.findMany({
      where: {
        OR: [
          { companyId: sourceCompanyId },
          { companies: { some: { id: sourceCompanyId } } },
        ],
      },
      select: { id: true, name: true, description: true },
      orderBy: { name: 'asc' },
    });
  }
}
