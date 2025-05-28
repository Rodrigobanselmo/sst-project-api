import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { AbsenteeismRoutes } from '@/@v2/enterprise/absenteeism/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadAbsenteeismMotiveCountUseCase } from '../use-cases/read-absenteeism.usecase';
import { AbsenteeismPath } from './read-absenteeism.path';
import { AbsenteeismQuery } from './read-absenteeism.query';

@Controller(AbsenteeismRoutes.DASHBOARD.MOTIVE_COUNT)
@UseGuards(JwtAuthGuard)
export class ReadAbsenteeismMotiveCountController {
  constructor(private readonly absenteeismUseCase: ReadAbsenteeismMotiveCountUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: AbsenteeismPath, @Query() query: AbsenteeismQuery) {
    return this.absenteeismUseCase.execute({
      companyId: path.companyId,
      endDate: query.endDate,
      hierarchiesIds: query.hierarchiesIds,
      motivesIds: query.motivesIds,
      startDate: query.startDate,
      workspacesIds: query.workspacesIds,
    });
  }
}
