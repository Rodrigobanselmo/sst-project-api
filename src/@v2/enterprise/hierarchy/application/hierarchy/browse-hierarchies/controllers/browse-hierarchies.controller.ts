import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseHierarchiesUseCase } from '../use-cases/browse-hierarchies.usecase';
import { BrowseHierarchiesPath } from './browse-hierarchies.path';
import { BrowseHierarchiesQuery } from './browse-hierarchies.query';
import { HierarchyRoutes } from '@/@v2/enterprise/hierarchy/constants/routes';

@Controller(HierarchyRoutes.HIERARCHY.BROWSE_SHORT)
@UseGuards(JwtAuthGuard)
export class BrowseHierarchiesController {
  constructor(private readonly browseHierarchiesUseCase: BrowseHierarchiesUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseHierarchiesPath, @Query() query: BrowseHierarchiesQuery) {
    return this.browseHierarchiesUseCase.execute({
      companyId: path.companyId,
      workspaceIds: query.workspaceIds,
      orderBy: query.orderBy,
      search: query.search,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
