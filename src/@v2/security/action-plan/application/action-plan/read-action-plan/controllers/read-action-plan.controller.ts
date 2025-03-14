import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadActionPlanUseCase } from '../use-cases/read-action-plan.usecase';
import { FindActionPlanPath } from './read-action-plan.path';

@Controller(ActionPlanRoutes.ACTION_PLAN.READ)
@UseGuards(JwtAuthGuard)
export class ReadActionPlanController {
  constructor(private readonly findActionPlanUseCase: ReadActionPlanUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async find(@Param() path: FindActionPlanPath) {
    return this.findActionPlanUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      riskDataId: path.riskDataId,
      recommendationId: path.recommendationId,
    });
  }
}
