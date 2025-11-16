import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BrowseFormQuestionsAnswersAnalysisUseCase } from '../use-cases/browse-form-questions-answers-analysis.usecase';
import { FormQuestionsAnswersAnalysisBrowseModel } from '../../../../domain/models/form-questions-answers/form-questions-answers-analysis-browse.model';
import { BrowseFormQuestionsAnswersAnalysisParams } from './browse-form-questions-answers-analysis.params';
import { FormRoutes } from '../../../../constants/routes';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';
import { PermissionEnum } from '../../../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../../../shared/decorators/permissions.decorator';

@ApiTags('Forms - Questions Answers Analysis')
@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.BROWSE_ANALYSIS)
@UseGuards(JwtAuthGuard)
export class BrowseFormQuestionsAnswersAnalysisController {
  constructor(private readonly browseFormQuestionsAnswersAnalysisUseCase: BrowseFormQuestionsAnswersAnalysisUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() params: BrowseFormQuestionsAnswersAnalysisParams): Promise<FormQuestionsAnswersAnalysisBrowseModel> {
    return this.browseFormQuestionsAnswersAnalysisUseCase.execute({
      companyId: params.companyId,
      formApplicationId: params.applicationId,
    });
  }
}
