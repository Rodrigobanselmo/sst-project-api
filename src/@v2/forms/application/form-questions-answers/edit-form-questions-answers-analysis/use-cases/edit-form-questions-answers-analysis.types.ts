import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';

export namespace IEditFormQuestionsAnswersAnalysisUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    analysisId: string;
    analysis: AiRiskAnalysisResponse;
  };

  export type Result = {
    id: string;
    companyId: string;
    formApplicationId: string;
    hierarchyId: string;
    riskId: string;
    analysis: AiRiskAnalysisResponse;
    updatedAt: Date;
  };
}

