import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseSubTypeUseCase } from '../use-cases/browse-sub-type.usecase';
import { BrowseSubTypePath } from './browse-sub-type.path';
import { BrowseSubTypeQuery } from './browse-sub-type.query';
import { SubTypeRoutes } from '@/@v2/security/risk/constants/routes';

@Controller(SubTypeRoutes.SUB_TYPE.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseSubTypeController {
  constructor(private readonly browseSubTypeUseCase: BrowseSubTypeUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() _: BrowseSubTypePath, @Query() query: BrowseSubTypeQuery) {
    return this.browseSubTypeUseCase.execute({
      orderBy: query.orderBy,
      search: query.search,
      types: query.types,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
