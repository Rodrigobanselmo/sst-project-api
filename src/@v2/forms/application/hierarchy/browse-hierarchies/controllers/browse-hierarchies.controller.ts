import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseHierarchiesUseCase } from '../use-cases/browse-hierarchies.usecase';
import { BrowseHierarchiesPath } from './browse-hierarchies.path';
import { BrowseHierarchiesQuery } from './browse-hierarchies.query';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.HIERARCHY.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseHierarchiesController {
  constructor(private readonly browseHierarchiesUseCase: BrowseHierarchiesUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseHierarchiesPath, @Query() query: BrowseHierarchiesQuery) {
    return this.browseHierarchiesUseCase.execute({
      companyId: path.companyId,
      type: query.type,
      parent: query.parent,
    });
  }
}
