import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { BrowseCoordinatorPath } from './browse-coordinators.path'
import { BrowseCoordinatorQuery } from './browse-coordinators.query'
import { BrowseCoordinatorsUseCase } from '../use-cases/browse-coordinators.usecase'

@Controller(ActionPlanRoutes.COORDINATOR.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseCoordinatorsController {
  constructor(
    private readonly browseCoordinatorUseCase: BrowseCoordinatorsUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseCoordinatorPath, @Query() query: BrowseCoordinatorQuery) {
    return this.browseCoordinatorUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      pagination: {
        page: query.page,
        limit: query.limit
      },
    })
  }
}
