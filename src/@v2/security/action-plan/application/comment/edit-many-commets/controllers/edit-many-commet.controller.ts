import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditManyCommentsUseCase } from '../use-cases/edit-many-commets.usecase';
import { EditCommentPath } from './edit-many-commet.path';
import { EditManyCommentPayload } from './edit-many-commet.payload';

@Controller(ActionPlanRoutes.COMMENT.EDIT_MANY)
@UseGuards(JwtAuthGuard)
export class EditManyCommentController {
  constructor(private readonly editManyCommentsUseCase: EditManyCommentsUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditCommentPath, @Body() body: EditManyCommentPayload) {
    return this.editManyCommentsUseCase.execute({
      companyId: path.companyId,
      ...body,
    });
  }
}
