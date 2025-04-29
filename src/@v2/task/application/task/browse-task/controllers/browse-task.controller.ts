import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseTaskPath } from './browse-task.path';
import { BrowseTaskQuery } from './browse-task.query';
import { BrowseTaskUseCase } from '../use-cases/browse-task.usecase';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseTaskController {
  constructor(private readonly browseTaskUseCase: BrowseTaskUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseTaskPath, @Query() query: BrowseTaskQuery) {
    return this.browseTaskUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      statusIds: query.statusIds,
      actionPlanIds: query.actionPlanIds,
      creatorsIds: query.creatorsIds,
      responsibleIds: query.responsibleIds,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
