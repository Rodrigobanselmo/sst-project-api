import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EditFormQuestionsAnswersAnalysisUseCase } from '../use-cases/edit-form-questions-answers-analysis.usecase';
import { EditFormQuestionsAnswersAnalysisPath } from './edit-form-questions-answers-analysis.path';
import { EditFormQuestionsAnswersAnalysisPayload } from './edit-form-questions-answers-analysis.payload';
import { FormRoutes } from '../../../../constants/routes';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';
import { PermissionEnum } from '../../../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../../../shared/decorators/permissions.decorator';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.EDIT_ANALYSIS)
@UseGuards(JwtAuthGuard)
export class EditFormQuestionsAnswersAnalysisController {
  constructor(private readonly editFormQuestionsAnswersAnalysisUseCase: EditFormQuestionsAnswersAnalysisUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditFormQuestionsAnswersAnalysisPath, @Body() body: EditFormQuestionsAnswersAnalysisPayload) {
    return this.editFormQuestionsAnswersAnalysisUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      analysisId: path.analysisId,
      analysis: body.analysis,
    });
  }
}
