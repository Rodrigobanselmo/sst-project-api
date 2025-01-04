import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseCommentCreatorPath } from './browse-comment-creators.path';
import { BrowseCommentCreatorQuery } from './browse-comment-creators.query';
import { BrowseCommentCreatorsUseCase } from '../use-cases/browse-comment-creators.usecase';

@Controller(ActionPlanRoutes.COMMENT.CREATOR.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseCommentCreatorsController {
  constructor(private readonly browseCommentCreatorUseCase: BrowseCommentCreatorsUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseCommentCreatorPath, @Query() query: BrowseCommentCreatorQuery) {
    return this.browseCommentCreatorUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
