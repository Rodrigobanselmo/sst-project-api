import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DeleteActionPlanPhotoFileUseCase } from '../use-cases/delete-action-plan-photo-file.usecase';
import { DeleteFilePath } from './delete-action-plan-photo-file.path';

@Controller(ActionPlanRoutes.ACTION_PLAN.PHOTO.DELETE)
@UseGuards(JwtAuthGuard)
export class DeleteActionPlanPhotoFileController {
  constructor(private readonly deleteActionPlanPhotoFileUseCase: DeleteActionPlanPhotoFileUseCase) {}

  @Delete()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: DeleteFilePath) {
    return this.deleteActionPlanPhotoFileUseCase.execute({
      companyId: path.companyId,
      id: path.photoId,
    });
  }
}
