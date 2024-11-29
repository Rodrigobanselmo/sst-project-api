import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { EditActionPlanInfoUseCase } from '../use-cases/edit-action-plan-info.usecase'
import { EditActionPlanPath } from './edit-action-plan-info.path'
import { EditActionPlanInfoPayload } from './edit-action-plan-info.payload'

@Controller(ActionPlanRoutes.ACTION_PLAN_INFO.EDIT)
@UseGuards(JwtAuthGuard)
export class EditActionPlanInfoController {
  constructor(
    private readonly editActionPlanInfoUseCase: EditActionPlanInfoUseCase
  ) { }

  @Post()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditActionPlanPath, @Body() body: EditActionPlanInfoPayload) {
    return this.editActionPlanInfoUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      ...body
    })
  }
}
