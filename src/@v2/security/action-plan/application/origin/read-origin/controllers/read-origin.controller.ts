import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadOriginUseCase } from '../use-cases/find-origin.usecase';
import { FindOriginPath } from './read-origin.path';

@Controller(ActionPlanRoutes.ORIGIN.GET)
@UseGuards(JwtAuthGuard)
export class FindOriginController {
  constructor(private readonly findActionPlanUseCase: ReadOriginUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async find(@Param() path: FindOriginPath) {
    return this.findActionPlanUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      id: path.id,
      recommendationId: path.recommendationId,
    });
  }
}
