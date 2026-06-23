import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { RecoverStuckFormQuestionsAnswersAnalysisUseCase } from '../use-cases/recover-stuck-form-questions-answers-analysis.usecase';
import { RecoverStuckFormQuestionsAnswersAnalysisPath } from './recover-stuck-form-questions-answers-analysis.path';
import { RecoverStuckFormQuestionsAnswersAnalysisPayload } from './recover-stuck-form-questions-answers-analysis.payload';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.RECOVER_STUCK_ANALYSIS)
@UseGuards(JwtAuthGuard)
export class RecoverStuckFormQuestionsAnswersAnalysisController {
  constructor(
    private readonly recoverStuckFormQuestionsAnswersAnalysisUseCase: RecoverStuckFormQuestionsAnswersAnalysisUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async recover(
    @Param() path: RecoverStuckFormQuestionsAnswersAnalysisPath,
    @Body() body: RecoverStuckFormQuestionsAnswersAnalysisPayload,
  ) {
    return this.recoverStuckFormQuestionsAnswersAnalysisUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      scope: body.scope,
      dryRun: body.dryRun,
      olderThanMinutes: body.olderThanMinutes,
      riskId: body.riskId,
      hierarchyId: body.hierarchyId,
      hierarchyGroupId: body.hierarchyGroupId,
    });
  }
}
