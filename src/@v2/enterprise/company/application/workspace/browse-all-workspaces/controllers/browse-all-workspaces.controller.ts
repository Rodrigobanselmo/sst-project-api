import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { BrowseWorkspaceUseCase } from '../use-cases/browse-all-workspaces.usecase'
import { BrowseWorkspacePath } from './browse-all-workspaces.path'
import { BrowseWorkspaceQuery } from './browse-all-workspaces.query'
import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes'

@Controller(CompanyRoutes.WORKSPACE.BROWSE_ALL)
@UseGuards(JwtAuthGuard)
export class BrowseWorkspaceController {
  constructor(
    private readonly browseWorkspaceUseCase: BrowseWorkspaceUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseWorkspacePath, @Query() query: BrowseWorkspaceQuery) {
    return this.browseWorkspaceUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
    })
  }
}
