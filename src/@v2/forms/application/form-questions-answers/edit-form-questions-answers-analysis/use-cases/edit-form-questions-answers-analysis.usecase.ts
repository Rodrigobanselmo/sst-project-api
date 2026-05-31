import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';
import {
  detectRemovedAnalysisItems,
  getExcludedItemsFromMetadata,
  mergeExcludedItems,
  parseStoredAnalysisResponse,
} from '../../ai-analyze-form-questions-risks/use-cases/ai-risk-analysis-merge.helpers';
import { IEditFormQuestionsAnswersAnalysisUseCase } from './edit-form-questions-answers-analysis.types';

@Injectable()
export class EditFormQuestionsAnswersAnalysisUseCase {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  async execute(params: IEditFormQuestionsAnswersAnalysisUseCase.Params): Promise<IEditFormQuestionsAnswersAnalysisUseCase.Result> {
    await this.formApplicationScopeService.resolve({
      formApplicationId: params.formApplicationId,
      accessCompanyId: params.companyId,
    });

    const existingAnalysis = await this.prisma.formAiAnalysis.findFirst({
      where: {
        id: params.analysisId,
        formApplicationId: params.formApplicationId,
      },
    });

    if (!existingAnalysis) {
      throw new NotFoundException('Análise não encontrada');
    }

    if (!params.analysis || typeof params.analysis !== 'object') {
      throw new BadRequestException('Análise inválida');
    }

    const previousAnalysis = parseStoredAnalysisResponse(existingAnalysis.analysis);
    const nextAnalysis = params.analysis as AiRiskAnalysisResponse;
    const removedItems = detectRemovedAnalysisItems(previousAnalysis, nextAnalysis);
    const existingMetadata =
      (existingAnalysis.metadata as Record<string, unknown> | null) ?? {};
    const excludedItems = mergeExcludedItems(
      getExcludedItemsFromMetadata(existingMetadata),
      removedItems,
    );

    const updatedAnalysis = await this.prisma.formAiAnalysis.update({
      where: {
        id: params.analysisId,
      },
      data: {
        analysis: params.analysis as any,
        metadata: {
          ...existingMetadata,
          excludedItems,
        },
        updated_at: new Date(),
      },
    });

    return {
      id: updatedAnalysis.id,
      companyId: updatedAnalysis.companyId,
      formApplicationId: updatedAnalysis.formApplicationId,
      hierarchyId: updatedAnalysis.hierarchyId,
      riskId: updatedAnalysis.riskId,
      analysis: updatedAnalysis.analysis as any,
      updatedAt: updatedAnalysis.updated_at,
    };
  }
}
