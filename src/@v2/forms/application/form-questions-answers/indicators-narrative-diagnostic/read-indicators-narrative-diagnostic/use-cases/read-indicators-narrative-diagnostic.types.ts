import { IndicatorsNarrativeDiagnosticScope } from '../../shared/indicators-narrative-diagnostic-scope.types';

export namespace IReadIndicatorsNarrativeDiagnosticUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    scopeKey?: string;
    scope: {
      groupingQuestionId?: string | null;
      participantGroupIds?: string[];
      groupingLabel?: string | null;
      showOnlyGroupIndicators?: unknown;
    };
  };

  export type Result = {
    id: string;
    formApplicationId: string;
    scopeKey: string;
    scope: IndicatorsNarrativeDiagnosticScope;
    status: string;
    contentMarkdown: string | null;
    metadata?: Record<string, unknown>;
    model: string | null;
    processingTimeMs: number | null;
    generatedBy: number | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}
