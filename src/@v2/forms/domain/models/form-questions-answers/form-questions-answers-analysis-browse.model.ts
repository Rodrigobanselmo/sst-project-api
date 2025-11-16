import { AiRiskAnalysisResponse } from '../../../../shared/types/ai-risk-analysis-response.types';
import { FormAiAnalysisStatusEnum } from '@prisma/client';

export type IFormQuestionsAnswersAnalysisBrowseResultModel = {
  id: string;
  companyId: string;
  formApplicationId: string;
  hierarchyId: string;
  riskId: string;
  status: FormAiAnalysisStatusEnum;
  probability?: number;
  confidence?: number;
  analysis?: AiRiskAnalysisResponse;
  model?: string;
  processingTimeMs?: number;
  createdAt: Date;
  updatedAt: Date;
};

export class FormQuestionsAnswersAnalysisBrowseResultModel {
  id: string;
  companyId: string;
  formApplicationId: string;
  hierarchyId: string;
  riskId: string;
  status: FormAiAnalysisStatusEnum;
  probability?: number;
  confidence?: number;
  analysis?: AiRiskAnalysisResponse;
  model?: string;
  processingTimeMs?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: IFormQuestionsAnswersAnalysisBrowseResultModel) {
    this.id = params.id;
    this.companyId = params.companyId;
    this.formApplicationId = params.formApplicationId;
    this.hierarchyId = params.hierarchyId;
    this.riskId = params.riskId;
    this.status = params.status;
    this.probability = params.probability;
    this.confidence = params.confidence;
    this.analysis = params.analysis;
    this.model = params.model;
    this.processingTimeMs = params.processingTimeMs;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}

export type IFormQuestionsAnswersAnalysisBrowseModel = {
  results: FormQuestionsAnswersAnalysisBrowseResultModel[];
};

export class FormQuestionsAnswersAnalysisBrowseModel {
  results: FormQuestionsAnswersAnalysisBrowseResultModel[];

  constructor(params: IFormQuestionsAnswersAnalysisBrowseModel) {
    this.results = params.results;
  }
}
