import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { SecurityRoutes } from '@/@v2/security/characterization/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditManyCharacterizationUseCase } from '../use-cases/edit-many-characterization.usecase';
import { EditCharacterizationPath } from './edit-many-characterization.path';
import { EditCharacterizationPayload } from './edit-many-characterization.payload';

@Controller(SecurityRoutes.CHARACTERIZATION.EDIT_MANY)
@UseGuards(JwtAuthGuard)
export class EditManyCharacterizationController {
  constructor(private readonly editCharacterizationUseCase: EditManyCharacterizationUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditCharacterizationPath, @Body() body: EditCharacterizationPayload) {
    return this.editCharacterizationUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      ids: body.ids,
      stageId: body.stageId,
    });
  }
}
