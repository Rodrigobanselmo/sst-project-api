import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseGenerateSourcesUseCase } from '../use-cases/browse-generate-sources.usecase';
import { BrowseGenerateSourcesPath } from './browse-generate-sources.path';
import { BrowseGenerateSourcesQuery } from './browse-generate-sources.query';

@Controller(ActionPlanRoutes.GENERATE_SOURCE.BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseGenerateSourcesController {
  constructor(private readonly browseGenerateSourcesUseCase: BrowseGenerateSourcesUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: BrowseGenerateSourcesPath, @Query() query: BrowseGenerateSourcesQuery) {
    return this.browseGenerateSourcesUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      riskIds: query.riskIds,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
