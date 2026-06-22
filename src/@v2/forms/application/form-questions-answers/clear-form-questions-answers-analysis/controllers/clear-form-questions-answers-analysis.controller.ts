import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ClearFormQuestionsAnswersAnalysisUseCase } from '../use-cases/clear-form-questions-answers-analysis.usecase';
import { ClearFormQuestionsAnswersAnalysisPath } from './clear-form-questions-answers-analysis.path';
import { ClearFormQuestionsAnswersAnalysisPayload } from './clear-form-questions-answers-analysis.payload';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.CLEAR_ANALYSIS)
@UseGuards(JwtAuthGuard)
export class ClearFormQuestionsAnswersAnalysisController {
  constructor(
    private readonly clearFormQuestionsAnswersAnalysisUseCase: ClearFormQuestionsAnswersAnalysisUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async clear(
    @Param() path: ClearFormQuestionsAnswersAnalysisPath,
    @Body() body: ClearFormQuestionsAnswersAnalysisPayload,
  ) {
    return this.clearFormQuestionsAnswersAnalysisUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      scope: body.scope,
      dryRun: body.dryRun,
      riskId: body.riskId,
      hierarchyId: body.hierarchyId,
      hierarchyGroupId: body.hierarchyGroupId,
    });
  }
}
