import {
  computeAnalysisQuotas,
  parseStoredAnalysisResponse,
  shouldSkipCompleteAnalysis,
} from '@/@v2/forms/application/form-questions-answers/ai-analyze-form-questions-risks/use-cases/ai-risk-analysis-merge.helpers';

export const DEFAULT_STUCK_AI_ANALYSIS_OLDER_THAN_MINUTES = 60;

export type StuckAiAnalysisRecoveryAction = 'DONE' | 'FAILED';

export function isStuckProcessingRecord(params: {
  status: string;
  updatedAt?: Date | null;
  createdAt?: Date | null;
  olderThanMinutes?: number;
}): boolean {
  if (params.status !== 'PROCESSING') return false;

  const olderThanMinutes =
    params.olderThanMinutes ?? DEFAULT_STUCK_AI_ANALYSIS_OLDER_THAN_MINUTES;
  const referenceDate = params.updatedAt ?? params.createdAt;
  if (!referenceDate) return false;

  const thresholdMs = olderThanMinutes * 60 * 1000;
  return Date.now() - referenceDate.getTime() >= thresholdMs;
}

export function resolveStuckAiAnalysisRecoveryAction(
  analysis: unknown,
): StuckAiAnalysisRecoveryAction {
  const parsed = parseStoredAnalysisResponse(analysis);
  if (!parsed) return 'FAILED';

  const quotas = computeAnalysisQuotas(parsed);
  if (shouldSkipCompleteAnalysis(quotas)) {
    return 'DONE';
  }

  const hasFontes = (parsed.fontesGeradoras?.length ?? 0) > 0;
  const hasRecommendations =
    (parsed.medidasEngenhariaRecomendadas?.length ?? 0) > 0 ||
    (parsed.medidasAdministrativasRecomendadas?.length ?? 0) > 0;

  return hasFontes || hasRecommendations ? 'DONE' : 'FAILED';
}

export function buildStuckAiAnalysisRecoveryMetadata(params: {
  existingMetadata: Record<string, unknown>;
  action: StuckAiAnalysisRecoveryAction;
  recoveredAt: string;
}): Record<string, unknown> {
  if (params.action === 'DONE') {
    return {
      ...params.existingMetadata,
      recoveredFromStuckProcessing: true,
      recoveredAt: params.recoveredAt,
      previousStatus: 'PROCESSING',
    };
  }

  return {
    ...params.existingMetadata,
    markedFailedFromStuckProcessing: true,
    recoveredAt: params.recoveredAt,
    previousStatus: 'PROCESSING',
    reason: 'stale_processing_without_complete_analysis',
  };
}
