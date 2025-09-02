import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseRisksUseCase } from '../use-cases/browse-risks.usecase';
import { BrowseRisksPath } from './browse-risks.path';
import { BrowseRisksQuery } from './browse-risks.query';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.RISK.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseRisksController {
  constructor(private readonly browseRisksUseCase: BrowseRisksUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseRisksPath, @Query() query: BrowseRisksQuery) {
    return this.browseRisksUseCase.execute({
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
