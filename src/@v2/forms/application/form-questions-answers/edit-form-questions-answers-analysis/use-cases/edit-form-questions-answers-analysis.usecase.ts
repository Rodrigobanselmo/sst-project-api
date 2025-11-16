import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IEditFormQuestionsAnswersAnalysisUseCase } from './edit-form-questions-answers-analysis.types';

@Injectable()
export class EditFormQuestionsAnswersAnalysisUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IEditFormQuestionsAnswersAnalysisUseCase.Params): Promise<IEditFormQuestionsAnswersAnalysisUseCase.Result> {
    // Validate that the analysis exists and belongs to the company
    const existingAnalysis = await this.prisma.formAiAnalysis.findFirst({
      where: {
        id: params.analysisId,
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
      },
    });

    if (!existingAnalysis) {
      throw new NotFoundException('Análise não encontrada');
    }

    // Validate the analysis object structure
    if (!params.analysis || typeof params.analysis !== 'object') {
      throw new BadRequestException('Análise inválida');
    }

    // Update only the analysis field
    const updatedAnalysis = await this.prisma.formAiAnalysis.update({
      where: {
        id: params.analysisId,
      },
      data: {
        analysis: params.analysis as any,
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

