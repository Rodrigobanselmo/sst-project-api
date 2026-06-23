import { ClearFormAiAnalysisScopeEnum } from '@/@v2/forms/application/form-questions-answers/clear-form-questions-answers-analysis/use-cases/clear-form-questions-answers-analysis.types';
import { StuckAiAnalysisRecoveryAction } from '@/@v2/forms/application/form-questions-answers/shared/helpers/stuck-form-ai-analysis.helpers';

export { ClearFormAiAnalysisScopeEnum as RecoverStuckFormAiAnalysisScopeEnum };

export namespace IRecoverStuckFormQuestionsAnswersAnalysisUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    scope: ClearFormAiAnalysisScopeEnum;
    dryRun?: boolean;
    olderThanMinutes?: number;
    riskId?: string;
    hierarchyId?: string;
    hierarchyGroupId?: string;
  };

  export type StuckAnalysisItem = {
    id: string;
    riskId: string;
    hierarchyId: string;
    riskName: string;
    hierarchyName: string;
    updatedAt: Date;
    recoveryAction: StuckAiAnalysisRecoveryAction;
  };

  export type Result = {
    dryRun: boolean;
    scope: ClearFormAiAnalysisScopeEnum;
    olderThanMinutes: number;
    totalStuckCount: number;
    promoteToDoneCount: number;
    markAsFailedCount: number;
    recoveredCount: number;
    filters: {
      riskId?: string | null;
      hierarchyId?: string | null;
      hierarchyGroupId?: string | null;
      expandedHierarchyIds?: string[];
    };
    items: StuckAnalysisItem[];
  };
}
