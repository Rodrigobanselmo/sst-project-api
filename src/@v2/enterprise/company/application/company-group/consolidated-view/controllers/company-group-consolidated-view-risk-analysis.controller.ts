import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupConsolidatedViewPath } from './company-group-consolidated-view.path';
import { CompanyGroupConsolidatedViewQuery } from './company-group-consolidated-view.query';
import { CompanyGroupConsolidatedViewRiskAnalysisUseCase } from '../use-cases/company-group-consolidated-view-risk-analysis.usecase';

@Controller(CompanyRoutes.COMPANY_GROUP.CONSOLIDATED_VIEW_RISK_ANALYSIS)
@UseGuards(JwtAuthGuard)
export class CompanyGroupConsolidatedViewRiskAnalysisController {
  constructor(
    private readonly companyGroupConsolidatedViewRiskAnalysisUseCase: CompanyGroupConsolidatedViewRiskAnalysisUseCase,
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
    return this.companyGroupConsolidatedViewRiskAnalysisUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: query.applicationIds,
      user,
    });
  }
}
