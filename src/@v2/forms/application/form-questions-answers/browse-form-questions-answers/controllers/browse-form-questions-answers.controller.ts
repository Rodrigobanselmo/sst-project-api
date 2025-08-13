import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseFormQuestionsAnswersUseCase } from '../use-cases/browse-form-questions-answers.usecase';
import { BrowseFormQuestionsAnswersPath } from './browse-form-questions-answers.path';
import { BrowseFormQuestionsAnswersQuery } from './browse-form-questions-answers.query';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseFormQuestionsAnswersController {
  constructor(private readonly browseFormQuestionsAnswersUseCase: BrowseFormQuestionsAnswersUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseFormQuestionsAnswersPath, @Query() query: BrowseFormQuestionsAnswersQuery) {
    return this.browseFormQuestionsAnswersUseCase.execute({
      companyId: path.companyId,
      formApplicationId: query.formApplicationId,
      search: query.search,
    });
  }
}
