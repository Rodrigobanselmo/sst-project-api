import { FormAiAnalysisStatusEnum } from '@prisma/client';
import { RiskNarrativeDiagnosticScope } from '../../shared/risk-narrative-diagnostic-scope.types';

export namespace IReadRiskNarrativeDiagnosticUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    scope: RiskNarrativeDiagnosticScope;
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
    processingTimeMs?: number | null;
    generatedBy?: number | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}
