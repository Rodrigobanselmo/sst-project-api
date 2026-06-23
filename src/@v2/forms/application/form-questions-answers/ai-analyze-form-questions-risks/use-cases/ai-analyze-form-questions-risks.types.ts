import { HierarchyEnum, RiskFactorsEnum } from '@prisma/client';
import { AiRiskAnalysisResponse } from '../../../../../shared/types/ai-risk-analysis-response.types';
import {
  AiAnalyzeFormQuestionsRisksModeEnum,
  AnalysisQuotas,
  ExcludedAnalysisItem,
} from './ai-risk-analysis-merge.helpers';

export namespace IAiAnalyzeFormQuestionsRisksUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    mode?: AiAnalyzeFormQuestionsRisksModeEnum;
    riskId?: string;
    hierarchyId?: string;
    customPrompt?: string;
    model?: string;
    /** Resolved server-side; do not send from client. */
    analysisPrompt?: string;
  };

  export type QuestionData = {
    id: string;
    text: string;
    probability: number;
    values: number[];
  };

  export type HierarchyRiskAnalysisScope = 'individual' | 'hierarchy_group';

  export type HierarchyRiskData = {
    hierarchyId: string;
    hierarchyName: string;
    hierarchyType: HierarchyEnum;
    riskId: string;
    riskName: string;
    riskType: RiskFactorsEnum;
    probability: number;
    questions: QuestionData[];
    probabilitySource?: 'individual' | 'hierarchy_group';
    hierarchyGroupId?: string;
    hierarchyGroupName?: string;
    analysisScope?: HierarchyRiskAnalysisScope;
    memberHierarchyIds?: string[];
    memberHierarchyNames?: string[];
  };

  export type AvailableRiskData = {
    id: string;
    name: string;
    type: RiskFactorsEnum;
    severity: number;
    generateSources: Array<{
      id: string;
      name: string;
    }>;
    administrativeMeasures: Array<{
      id: string;
      name: string;
    }>;
    engineeringMeasures: Array<{
      id: string;
      name: string;
    }>;
  };

  export type AnalysisJob = {
    hierarchyRisk: HierarchyRiskData;
    existingAnalysis: AiRiskAnalysisResponse | null;
    existingMetadata: Record<string, unknown>;
    excludedItems: ExcludedAnalysisItem[];
    quotas: AnalysisQuotas;
  };

  export type HierarchyRiskAnalysis = {
    hierarchyId: string;
    hierarchyName: string;
    riskId: string;
    riskName: string;
    riskType: RiskFactorsEnum;
    probability: number;
    analysis: AiRiskAnalysisResponse;
    confidence: number;
    questionsAnalyzed: number;
    metadata?: Record<string, any>;
    replicateToHierarchyIds?: string[];
    memberHierarchyNameById?: Record<string, string>;
  };

  export type Result = {
    analyses: HierarchyRiskAnalysis[];
    totalHierarchies: number;
    totalRisks: number;
    totalAnalyses: number;
    metadata: {
      companyId: string;
      formApplicationId: string;
      timestamp: string;
      model?: string;
      processingTimeMs: number;
      failedAnalyses?: number;
      analysesQueued?: number;
      analysesSkipped?: number;
      analysesComplemented?: number;
      mode?: AiAnalyzeFormQuestionsRisksModeEnum;
      targetRiskId?: string;
      targetHierarchyId?: string;
      promptKey?: string;
      promptSource?: string;
      promptLength?: number;
      promptRevision?: number;
    };
  };
}
