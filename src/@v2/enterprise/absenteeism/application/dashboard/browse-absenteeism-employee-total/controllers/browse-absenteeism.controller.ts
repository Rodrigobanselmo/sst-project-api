import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseAbsenteeismEmployeeTotalUseCase } from '../use-cases/browse-absenteeism.usecase';
import { BrowseAbsenteeismPath } from './browse-absenteeism.path';
import { BrowseAbsenteeismQuery } from './browse-absenteeism.query';
import { AbsenteeismRoutes } from '@/@v2/enterprise/absenteeism/constants/routes';

@Controller(AbsenteeismRoutes.DASHBOARD.EMPLOYEE_TOTAL_BROWSE)
@UseGuards(JwtAuthGuard)
export class BrowseAbsenteeismEmployeeTotalController {
  constructor(private readonly browseAbsenteeismUseCase: BrowseAbsenteeismEmployeeTotalUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseAbsenteeismPath, @Query() query: BrowseAbsenteeismQuery) {
    return this.browseAbsenteeismUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      endDate: query.endDate,
      hierarchiesIds: query.hierarchiesIds,
      motivesIds: query.motivesIds,
      startDate: query.startDate,
      workspacesIds: query.workspacesIds,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
