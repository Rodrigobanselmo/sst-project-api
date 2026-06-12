import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupConsolidatedViewPath } from './company-group-consolidated-view.path';
import { CompanyGroupConsolidatedViewQuestionsAnswersQuery } from './company-group-consolidated-view-questions-answers.query';
import { CompanyGroupConsolidatedViewQuestionsAnswersUseCase } from '../use-cases/company-group-consolidated-view-questions-answers.usecase';

@Controller(CompanyRoutes.COMPANY_GROUP.CONSOLIDATED_VIEW_QUESTIONS_ANSWERS)
@UseGuards(JwtAuthGuard)
export class CompanyGroupConsolidatedViewQuestionsAnswersController {
  constructor(
    private readonly companyGroupConsolidatedViewQuestionsAnswersUseCase: CompanyGroupConsolidatedViewQuestionsAnswersUseCase,
  ) {}

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: 'r',
  })
  async execute(
    @Param() path: CompanyGroupConsolidatedViewPath,
    @Query() query: CompanyGroupConsolidatedViewQuestionsAnswersQuery,
    @User() user: UserPayloadDto,
  ) {
    return this.companyGroupConsolidatedViewQuestionsAnswersUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: query.applicationIds,
      user,
    });
  }
}
