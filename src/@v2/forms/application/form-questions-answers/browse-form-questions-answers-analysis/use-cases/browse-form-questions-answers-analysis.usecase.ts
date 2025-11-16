import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '../../../../../shared/adapters/database/prisma.service';
import {
  FormQuestionsAnswersAnalysisBrowseModel,
  FormQuestionsAnswersAnalysisBrowseResultModel,
} from '../../../../../forms/domain/models/form-questions-answers/form-questions-answers-analysis-browse.model';
import { IBrowseFormQuestionsAnswersAnalysisUseCase } from './browse-form-questions-answers-analysis.types';

@Injectable()
export class BrowseFormQuestionsAnswersAnalysisUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IBrowseFormQuestionsAnswersAnalysisUseCase.Params): Promise<FormQuestionsAnswersAnalysisBrowseModel> {
    // Get AI analysis results from database
    const analysisResults = await this.prisma.formAiAnalysis.findMany({
      where: {
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
      },
      include: {
        hierarchy: {
          select: {
            name: true,
          },
        },
        riskFactor: {
          select: {
            name: true,
            type: true,
          },
        },
      },
      orderBy: [{ hierarchy: { name: 'asc' } }, { riskFactor: { name: 'asc' } }, { created_at: 'desc' }],
    });

    // Map results to domain models
    const results = analysisResults.map(
      (analysis) =>
        new FormQuestionsAnswersAnalysisBrowseResultModel({
          id: analysis.id,
          companyId: analysis.companyId,
          formApplicationId: analysis.formApplicationId,
          hierarchyId: analysis.hierarchyId,
          riskId: analysis.riskId,
          status: analysis.status,
          probability: analysis.probability || undefined,
          confidence: analysis.confidence || undefined,
          analysis: analysis.analysis as any,
          model: analysis.model || undefined,
          processingTimeMs: analysis.processingTimeMs || undefined,
          createdAt: analysis.created_at,
          updatedAt: analysis.updated_at,
        }),
    );

    return new FormQuestionsAnswersAnalysisBrowseModel({
      results,
    });
  }
}
