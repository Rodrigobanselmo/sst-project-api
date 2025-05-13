import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { StatusRoutes } from '@/@v2/security/status/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditStatusUseCase } from '../use-cases/edit-status.usecase';
import { EditStatusPath } from './edit-status.path';
import { EditStatusPayload } from './edit-status.payload';

@Controller(StatusRoutes.STATUS.EDIT)
@UseGuards(JwtAuthGuard)
export class EditStatusController {
  constructor(private readonly editStatusUseCase: EditStatusUseCase) {}

  @Patch()
  @Permissions(
    {
      code: PermissionEnum.CHARACTERIZATION,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.TASK,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  async browse(@Param() path: EditStatusPath, @Body() body: EditStatusPayload) {
    return this.editStatusUseCase.execute({
      id: path.id,
      companyId: path.companyId,
      name: body.name,
      color: body.color,
    });
  }
}
