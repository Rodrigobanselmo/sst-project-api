import { Readable } from 'stream';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadAbsenteeismHierarchyTimeCompareUseCase } from '../use-cases/read-absenteeism.usecase';
import { ReadAbsenteeismPath } from './read-absenteeism.path';
import { ReadAbsenteeismQuery } from './read-absenteeism.query';
import { AbsenteeismRoutes } from '@/@v2/enterprise/absenteeism/constants/routes';

@Controller(AbsenteeismRoutes.DASHBOARD.HIERARCHY_TIME_COMPARE)
@UseGuards(JwtAuthGuard)
export class ReadAbsenteeismHierarchTimeCompareController {
  constructor(private readonly browseAbsenteeismUseCase: ReadAbsenteeismHierarchyTimeCompareUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: ReadAbsenteeismPath, @Query() query: ReadAbsenteeismQuery) {
    return this.browseAbsenteeismUseCase.execute({
      companyId: path.companyId,
      items: query.items,
      range: query.range,
    });
  }
}
