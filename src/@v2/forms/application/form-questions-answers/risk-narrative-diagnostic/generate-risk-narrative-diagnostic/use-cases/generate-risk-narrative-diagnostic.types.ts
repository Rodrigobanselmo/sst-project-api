import { FormAiAnalysisStatusEnum } from '@prisma/client';
import { RiskNarrativeDiagnosticScope } from '../../shared/risk-narrative-diagnostic-scope.types';

export namespace IGenerateRiskNarrativeDiagnosticUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    scope: RiskNarrativeDiagnosticScope;
    customPrompt?: string;
    model?: string;
    regenerate?: boolean;
  };

  export type Result = {
    id: string;
    formApplicationId: string;
    scopeKey: string;
    scope: RiskNarrativeDiagnosticScope;
    status: FormAiAnalysisStatusEnum;
    contentMarkdown?: string | null;
    metadata?: Record<string, unknown>;
    model?: string | null;
    createdAt: string;
    updatedAt: string;
    analysesQueued: boolean;
  };
}
