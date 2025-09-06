import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseFormQuestionsAnswersRisksUseCase } from '../use-cases/browse-form-questions-answers-risks.usecase';
import { BrowseFormQuestionsAnswersRisksPath } from './browse-form-questions-answers-risks.path';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.PATH_RISKS)
@UseGuards(JwtAuthGuard)
export class BrowseFormQuestionsAnswersRisksController {
  constructor(private readonly browseFormQuestionsAnswersRisksUseCase: BrowseFormQuestionsAnswersRisksUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseFormQuestionsAnswersRisksPath) {
    return this.browseFormQuestionsAnswersRisksUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
    });
  }
}
