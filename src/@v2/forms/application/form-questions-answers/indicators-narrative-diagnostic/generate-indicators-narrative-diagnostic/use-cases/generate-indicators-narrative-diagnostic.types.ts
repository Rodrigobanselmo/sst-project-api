import { IndicatorsNarrativeDiagnosticScope } from '../../shared/indicators-narrative-diagnostic-scope.types';

export namespace IGenerateIndicatorsNarrativeDiagnosticUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    scope: {
      groupingQuestionId?: string | null;
      participantGroupIds?: string[];
      groupingLabel?: string | null;
      showOnlyGroupIndicators: boolean;
    };
    customPrompt?: string;
    model?: string;
    regenerate?: boolean;
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
    createdAt: string;
    updatedAt: string;
    analysesQueued: boolean;
  };
}
