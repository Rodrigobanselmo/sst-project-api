import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { EditManyActionPlanUseCase } from '../use-cases/edit-many-action-plan.usecase'
import { EditActionPlanPath } from './edit-many-action-plan.path'
import { EditActionPlanPayload } from './edit-many-action-plan.payload'

@Controller(SecurityRoutes.ACTION_PLAN.EDIT_MANY)
@UseGuards(JwtAuthGuard)
export class EditManyActionPlanController {
  constructor(
    private readonly editActionPlanUseCase: EditManyActionPlanUseCase
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
      ids: body.ids,
      ...body
    })
  }
}
