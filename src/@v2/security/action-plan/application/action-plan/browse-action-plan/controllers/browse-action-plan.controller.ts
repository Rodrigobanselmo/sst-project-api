import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseActionPlanUseCase } from '../use-cases/browse-action-plan.usecase';
import { BrowseActionPlanPath } from './browse-action-plan.path';
import { BrowseActionPlanQuery } from './browse-action-plan.query';

@Controller(ActionPlanRoutes.ACTION_PLAN.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseActionPlanController {
  constructor(private readonly browseActionPlanUseCase: BrowseActionPlanUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseActionPlanPath, @Query() query: BrowseActionPlanQuery) {
    return this.browseActionPlanUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      orderBy: query.orderBy,
      search: query.search,
      status: query.status,
      responsibleIds: query.responsibleIds,
      occupationalRisks: query.occupationalRisks,
      generateSourceIds: query.generateSourceIds,
      hierarchyIds: query.hierarchyIds,
      recommendationIds: query.recommendationIds,
      riskIds: query.riskIds,
      isExpired: query.isExpired || undefined,
      riskSubTypes: query.riskSubTypes,
      riskTypes: query.riskTypes,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
