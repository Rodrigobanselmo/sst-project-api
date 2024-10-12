import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { BrowseStatusPath } from './browse-status.path'
import { BrowseStatusQuery } from './browse-status.query'
import { BrowseStatusUseCase } from '../use-cases/browse-status.usecase'

@Controller(SecurityRoutes.STATUS.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseStatusController {
  constructor(
    private readonly browseStatusUseCase: BrowseStatusUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseStatusPath, @Query() query: BrowseStatusQuery) {
    return this.browseStatusUseCase.execute({
      companyId: path.companyId,
      type: query.type,
    })
  }
}
