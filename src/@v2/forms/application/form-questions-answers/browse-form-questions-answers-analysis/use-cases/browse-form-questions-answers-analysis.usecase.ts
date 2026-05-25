import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '../../../../../shared/adapters/database/prisma.service';
import {
  FormQuestionsAnswersAnalysisBrowseModel,
  FormQuestionsAnswersAnalysisBrowseResultModel,
} from '../../../../../forms/domain/models/form-questions-answers/form-questions-answers-analysis-browse.model';
import { IBrowseFormQuestionsAnswersAnalysisUseCase } from './browse-form-questions-answers-analysis.types';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';

@Injectable()
export class BrowseFormQuestionsAnswersAnalysisUseCase {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  async execute(params: IBrowseFormQuestionsAnswersAnalysisUseCase.Params): Promise<FormQuestionsAnswersAnalysisBrowseModel> {
    const scope = await this.formApplicationScopeService.resolve({
      formApplicationId: params.formApplicationId,
      accessCompanyId: params.companyId,
    });

    const companyIds =
      this.formApplicationScopeService.participantCompanyIdsForScope(scope);

    const analysisResults = await this.prisma.formAiAnalysis.findMany({
      where: {
        companyId: { in: companyIds },
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
