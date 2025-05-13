import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseTaskProjectPath } from './browse-task-project.path';
import { BrowseTaskProjectQuery } from './browse-task-project.query';
import { BrowseTaskProjectUseCase } from '../use-cases/browse-task-project.usecase';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK_PROJECT.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseTaskProjectController {
  constructor(private readonly browseTaskProjectUseCase: BrowseTaskProjectUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseTaskProjectPath, @Query() query: BrowseTaskProjectQuery) {
    return this.browseTaskProjectUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      membersIds: query.membersIds,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
