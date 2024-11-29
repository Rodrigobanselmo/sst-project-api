import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { EditActionPlanUseCase } from '../use-cases/edit-action-plan.usecase'
import { EditActionPlanPath } from './edit-action-plan.path'
import { EditActionPlanPayload } from './edit-action-plan.payload'

@Controller(ActionPlanRoutes.ACTION_PLAN.EDIT)
@UseGuards(JwtAuthGuard)
export class EditActionPlanController {
  constructor(
    private readonly editActionPlanUseCase: EditActionPlanUseCase
  ) { }

  @Post()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditActionPlanPath, @Body() body: EditActionPlanPayload) {
    return this.editActionPlanUseCase.execute({
      companyId: path.companyId,
      comment: body.comment,
      ...body
    })
  }
}
