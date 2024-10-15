import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { BrowseCharacterizationUseCase } from '../use-cases/browse-characterizations.usecase'
import { BrowseCharacterizationPath } from './browse-characterizations.path'
import { BrowseCharacterizationQuery } from './browse-characterizations.query'

@Controller(SecurityRoutes.CHARACTERIZATION.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseCharacterizationController {
  constructor(
    private readonly browseCharacterizationUseCase: BrowseCharacterizationUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseCharacterizationPath, @Query() query: BrowseCharacterizationQuery) {
    return this.browseCharacterizationUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      orderBy: query.orderBy,
      search: query.search,
      stageIds: query.stageIds,
      pagination: {
        page: query.page,
        limit: query.limit
      },
    })
  }
}
