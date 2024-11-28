import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { BrowseActionPlanUseCase } from '../use-cases/browse-action-plan.usecase'
import { BrowseActionPlanPath } from './browse-action-plan.path'
import { BrowseActionPlanQuery } from './browse-action-plan.query'

@Controller(SecurityRoutes.ACTION_PLAN.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseActionPlanController {
  constructor(
    private readonly browseActionPlanUseCase: BrowseActionPlanUseCase
  ) { }

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
      workspaceIds: query.workspaceIds,
      orderBy: query.orderBy,
      search: query.search,
      status: query.status,
      responisbleIds: query.responisbleIds,
      ocupationalRisks: query.ocupationalRisks,
      generateSourceIds: query.generateSourceIds,
      hierarchyIds: query.hierarchyIds,
      recommendationIds: query.recommendationIds,
      riskIds: query.riskIds,
      isExpired: query.isExpired,
      pagination: {
        page: query.page,
        limit: query.limit
      },
    })
  }
}
