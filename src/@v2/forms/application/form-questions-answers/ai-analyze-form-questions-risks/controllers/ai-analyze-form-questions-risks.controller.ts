import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AiAnalyzeFormQuestionsRisksUseCase } from '../use-cases/ai-analyze-form-questions-risks.usecase';
import { AiAnalyzeFormQuestionsRisksPath } from './ai-analyze-form-questions-risks.path';
import { AiAnalyzeFormQuestionsRisksPayload } from './ai-analyze-form-questions-risks.payload';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.AI_ANALYZE_RISKS)
@UseGuards(JwtAuthGuard)
export class AiAnalyzeFormQuestionsRisksController {
  constructor(private readonly aiAnalyzeFormQuestionsRisksUseCase: AiAnalyzeFormQuestionsRisksUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async analyzeFormQuestionsRisks(@Param() path: AiAnalyzeFormQuestionsRisksPath, @Body() body: AiAnalyzeFormQuestionsRisksPayload) {
    const response = await this.aiAnalyzeFormQuestionsRisksUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      customPrompt: body.customPrompt,
      model: body.model,
    });

    return response;
  }
}
