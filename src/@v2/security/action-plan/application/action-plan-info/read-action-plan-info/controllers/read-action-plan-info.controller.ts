import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { ReadActionPlanInfoUseCase } from '../use-cases/find-action-plan-info.usecase'
import { FindActionPlanInfoPath } from './read-action-plan-info.path'

@Controller(SecurityRoutes.ACTION_PLAN_INFO.GET)
@UseGuards(JwtAuthGuard)
export class FindActionPlanInfoController {
  constructor(
    private readonly findActionPlanUseCase: ReadActionPlanInfoUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async find(@Param() path: FindActionPlanInfoPath) {
    return this.findActionPlanUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
    })
  }
}
