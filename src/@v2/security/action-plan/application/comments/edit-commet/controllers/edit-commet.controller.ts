import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/action-plan/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { EditCommentUseCase } from '../use-cases/edit-commet.usecase'
import { EditCommentPath } from './edit-commet.path'
import { EditManyCommentPayload } from './edit-many-commet.payload'

@Controller(SecurityRoutes.COMMENT.EDIT_MANY)
@UseGuards(JwtAuthGuard)
export class EditCommentController {
  constructor(
    private readonly editCommentUseCase: EditCommentUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditCommentPath, @Body() body: EditManyCommentPayload) {
    return this.editCommentUseCase.execute({
      companyId: path.companyId,
      ...body
    })
  }
}
