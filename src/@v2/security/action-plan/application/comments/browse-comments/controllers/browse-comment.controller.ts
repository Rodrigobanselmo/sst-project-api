import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { BrowseCommentsUseCase } from '../use-cases/browse-comments.usecase'
import { BrowseCommentsPath } from './browse-comment.path'
import { BrowseCommentsQuery } from './browse-comment.query'

@Controller(SecurityRoutes.COMMENT.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseCommentsController {
  constructor(
    private readonly browseCommentsUseCase: BrowseCommentsUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseCommentsPath, @Query() query: BrowseCommentsQuery) {
    return this.browseCommentsUseCase.execute({
      companyId: path.companyId,
      workspaceIds: query.workspaceIds,
      orderBy: query.orderBy,
      search: query.search,
      creatorsIds: query.creatorsIds,
      isApproved: query.isApproved,
      textType: query.textType,
      type: query.type,
      pagination: {
        page: query.page,
        limit: query.limit
      },
    })
  }
}
