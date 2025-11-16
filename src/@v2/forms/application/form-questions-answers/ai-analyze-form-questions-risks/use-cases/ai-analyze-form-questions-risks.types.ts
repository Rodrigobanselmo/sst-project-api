import { HierarchyEnum, RiskFactorsEnum } from '@prisma/client';
import { AiRiskAnalysisResponse } from '../../../../../shared/types/ai-risk-analysis-response.types';

export namespace IAiAnalyzeFormQuestionsRisksUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    customPrompt?: string;
    model?: string; // Optional AI model to use (e.g., 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo')
  };

  export type QuestionData = {
    id: string;
    text: string;
    probability: number; // Calculated probability from answers
    values: number[]; // All answer values for this question
  };

  export type HierarchyRiskData = {
    hierarchyId: string;
    hierarchyName: string;
    hierarchyType: HierarchyEnum;
    riskId: string;
    riskName: string;
    riskType: RiskFactorsEnum;
    probability: number; // Overall probability for this risk in this hierarchy
    questions: QuestionData[];
  };

  export type AvailableRiskData = {
    id: string;
    name: string;
    type: RiskFactorsEnum;
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
    };
  };
}
