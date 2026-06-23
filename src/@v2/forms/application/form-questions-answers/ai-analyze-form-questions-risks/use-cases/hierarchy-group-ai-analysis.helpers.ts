import { FormAiAnalysisStatusEnum } from '@prisma/client';
import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';
import { IAiAnalyzeFormQuestionsRisksUseCase } from './ai-analyze-form-questions-risks.types';
import {
  AnalysisQuotas,
  ExcludedAnalysisItem,
  computeAnalysisQuotas,
  getExcludedItemsFromMetadata,
  isRecentlyProcessingRecord,
  mergeExcludedItems,
  parseStoredAnalysisResponse,
  shouldSkipCompleteAnalysis,
} from './ai-risk-analysis-merge.helpers';

export const HIERARCHY_GROUP_ANALYSIS_SCOPE = 'hierarchy_group';

type ExistingRecord = {
  status: FormAiAnalysisStatusEnum;
  analysis: unknown;
  metadata: unknown;
  updated_at: Date;
  created_at: Date;
};

export function buildPairKey(hierarchyId: string, riskId: string): string {
  return `${hierarchyId}:${riskId}`;
}

export function getReplicationTargetHierarchyIds(
  hierarchyRisk: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData,
): string[] {
  if (
    hierarchyRisk.analysisScope === HIERARCHY_GROUP_ANALYSIS_SCOPE &&
    hierarchyRisk.memberHierarchyIds?.length
  ) {
    return hierarchyRisk.memberHierarchyIds;
  }

  return [hierarchyRisk.hierarchyId];
}

export function buildGroupReplicationMetadata(
  hierarchyRisk: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  if (hierarchyRisk.analysisScope !== HIERARCHY_GROUP_ANALYSIS_SCOPE) {
    return extra;
  }

  return {
    ...extra,
    hierarchyGroupId: hierarchyRisk.hierarchyGroupId,
    hierarchyGroupName: hierarchyRisk.hierarchyGroupName,
    analysisScope: HIERARCHY_GROUP_ANALYSIS_SCOPE,
    replicatedFromGroup: true,
  };
}

export function mergeExcludedItemsFromGroupMembers(params: {
  memberHierarchyIds: string[];
  riskId: string;
  existingRecordsByKey: Map<string, ExistingRecord>;
}): ExcludedAnalysisItem[] {
  let merged: ExcludedAnalysisItem[] = [];

  for (const hierarchyId of params.memberHierarchyIds) {
    const record = params.existingRecordsByKey.get(
      buildPairKey(hierarchyId, params.riskId),
    );
    merged = mergeExcludedItems(
      merged,
      getExcludedItemsFromMetadata(record?.metadata),
    );
  }

  return merged;
}

export function analysisContentFingerprint(
  analysis: AiRiskAnalysisResponse | null,
): string {
  if (!analysis) return '';

  const normalizeItems = (
    items: Array<{ nome: string }> | undefined,
  ): string[] =>
    (items ?? [])
      .map((item) => item.nome.trim().toLowerCase())
      .filter(Boolean)
      .sort();

  return JSON.stringify({
    frps: analysis.frps?.trim().toLowerCase() ?? '',
    fontesGeradoras: normalizeItems(analysis.fontesGeradoras),
    medidasEngenhariaRecomendadas: normalizeItems(
      analysis.medidasEngenhariaRecomendadas,
    ),
    medidasAdministrativasRecomendadas: normalizeItems(
      analysis.medidasAdministrativasRecomendadas,
    ),
  });
}

export function resolveGroupExistingAnalysisForIncremental(params: {
  memberHierarchyIds: string[];
  riskId: string;
  existingRecordsByKey: Map<string, ExistingRecord>;
}): AiRiskAnalysisResponse | null {
  for (const hierarchyId of params.memberHierarchyIds) {
    const record = params.existingRecordsByKey.get(
      buildPairKey(hierarchyId, params.riskId),
    );

    if (
      !record ||
      record.status === FormAiAnalysisStatusEnum.PROCESSING ||
      !record.analysis
    ) {
      continue;
    }

    const parsed = parseStoredAnalysisResponse(record.analysis);
    if (parsed) return parsed;
  }

  return null;
}

export type GroupIncrementalSkipDecision =
  | { action: 'skip' }
  | { action: 'queue'; existingAnalysis: AiRiskAnalysisResponse | null; quotas: AnalysisQuotas };

export function resolveGroupIncrementalSkipDecision(params: {
  hierarchyRisk: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData;
  existingRecordsByKey: Map<string, ExistingRecord>;
  isIncremental: boolean;
}): GroupIncrementalSkipDecision {
  const memberIds = getReplicationTargetHierarchyIds(params.hierarchyRisk);
  const { riskId } = params.hierarchyRisk;

  for (const hierarchyId of memberIds) {
    const record = params.existingRecordsByKey.get(buildPairKey(hierarchyId, riskId));

    if (
      record &&
      isRecentlyProcessingRecord({
        status: record.status,
        updatedAt: record.updated_at,
        createdAt: record.created_at,
      })
    ) {
      return { action: 'skip' };
    }
  }

  if (!params.isIncremental) {
    return {
      action: 'queue',
      existingAnalysis: null,
      quotas: computeAnalysisQuotas(null),
    };
  }

  const memberAnalyses: AiRiskAnalysisResponse[] = [];
  const memberQuotas: AnalysisQuotas[] = [];

  for (const hierarchyId of memberIds) {
    const record = params.existingRecordsByKey.get(buildPairKey(hierarchyId, riskId));

    if (!record || record.status !== FormAiAnalysisStatusEnum.DONE) {
      return {
        action: 'queue',
        existingAnalysis: resolveGroupExistingAnalysisForIncremental({
          memberHierarchyIds: memberIds,
          riskId,
          existingRecordsByKey: params.existingRecordsByKey,
        }),
        quotas: computeAnalysisQuotas(
          resolveGroupExistingAnalysisForIncremental({
            memberHierarchyIds: memberIds,
            riskId,
            existingRecordsByKey: params.existingRecordsByKey,
          }),
        ),
      };
    }

    const parsed = parseStoredAnalysisResponse(record.analysis);
    if (!parsed) {
      return {
        action: 'queue',
        existingAnalysis: null,
        quotas: computeAnalysisQuotas(null),
      };
    }

    memberAnalyses.push(parsed);
    memberQuotas.push(computeAnalysisQuotas(parsed));
  }

  const fingerprints = new Set(
    memberAnalyses.map((analysis) => analysisContentFingerprint(analysis)),
  );

  if (fingerprints.size > 1) {
    return {
      action: 'queue',
      existingAnalysis: memberAnalyses[0] ?? null,
      quotas: memberQuotas[0] ?? computeAnalysisQuotas(null),
    };
  }

  const referenceQuotas = memberQuotas[0] ?? computeAnalysisQuotas(null);
  if (shouldSkipCompleteAnalysis(referenceQuotas)) {
    return { action: 'skip' };
  }

  return {
    action: 'queue',
    existingAnalysis: memberAnalyses[0] ?? null,
    quotas: referenceQuotas,
  };
}

export function findEligibleHierarchyRiskTarget(
  eligibleData: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[],
  riskId: string,
  hierarchyId: string,
): IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData | undefined {
  const direct = eligibleData.find(
    (item) => item.riskId === riskId && item.hierarchyId === hierarchyId,
  );
  if (direct) return direct;

  return eligibleData.find(
    (item) =>
      item.riskId === riskId &&
      item.analysisScope === HIERARCHY_GROUP_ANALYSIS_SCOPE &&
      item.memberHierarchyIds?.includes(hierarchyId),
  );
}

export function expandResolvedAnalysisKeys(
  analysis: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskAnalysis,
): string[] {
  const targets =
    analysis.replicateToHierarchyIds?.length
      ? analysis.replicateToHierarchyIds
      : [analysis.hierarchyId];

  return targets.map((hierarchyId) => buildPairKey(hierarchyId, analysis.riskId));
}

export function expandFailedAnalysisTargets(
  failed: { hierarchyId: string; riskId: string; error: string },
  jobs: IAiAnalyzeFormQuestionsRisksUseCase.AnalysisJob[],
): Array<{ hierarchyId: string; riskId: string; error: string }> {
  const job = jobs.find(
    (item) =>
      item.hierarchyRisk.riskId === failed.riskId &&
      (item.hierarchyRisk.hierarchyId === failed.hierarchyId ||
        item.hierarchyRisk.memberHierarchyIds?.includes(failed.hierarchyId)),
  );

  if (!job) {
    return [failed];
  }

  return getReplicationTargetHierarchyIds(job.hierarchyRisk).map((hierarchyId) => ({
    hierarchyId,
    riskId: failed.riskId,
    error: failed.error,
  }));
}
