import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { BrowseResponsiblePath } from './browse-responsible.path'
import { BrowseResponsibleQuery } from './browse-responsible.query'
import { BrowseResponsiblesUseCase } from '../use-cases/browse-responsibles.usecase'

@Controller(SecurityRoutes.RESPONSIBLE.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseResponsiblesController {
  constructor(
    private readonly browseResponsibleUseCase: BrowseResponsiblesUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseResponsiblePath, @Query() query: BrowseResponsibleQuery) {
    return this.browseResponsibleUseCase.execute({
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
