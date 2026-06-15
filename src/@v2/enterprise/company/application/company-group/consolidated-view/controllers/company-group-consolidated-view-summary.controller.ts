import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupConsolidatedViewPath } from './company-group-consolidated-view.path';
import { CompanyGroupConsolidatedViewQuery } from './company-group-consolidated-view.query';
import { CompanyGroupConsolidatedViewSummaryUseCase } from '../use-cases/company-group-consolidated-view-summary.usecase';

@Controller(CompanyRoutes.COMPANY_GROUP.CONSOLIDATED_VIEW_SUMMARY)
@UseGuards(JwtAuthGuard)
export class CompanyGroupConsolidatedViewSummaryController {
  constructor(
    private readonly companyGroupConsolidatedViewSummaryUseCase: CompanyGroupConsolidatedViewSummaryUseCase,
  ) {}

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: 'r',
  })
  async execute(
    @Param() path: CompanyGroupConsolidatedViewPath,
    @Query() query: CompanyGroupConsolidatedViewQuery,
    @User() user: UserPayloadDto,
  ) {
    return this.companyGroupConsolidatedViewSummaryUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: query.applicationIds,
      user,
    });
  }
}
