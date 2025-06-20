import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { StatusRoutes } from '@/@v2/security/status/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DeleteStatusUseCase } from '../use-cases/delete-status.usecase';
import { DeleteStatusPath } from './delete-status.path';

@Controller(StatusRoutes.STATUS.DELETE)
@UseGuards(JwtAuthGuard)
export class DeleteStatusController {
  constructor(private readonly deleteStatusUseCase: DeleteStatusUseCase) {}

  @Delete()
  @Permissions(
    {
      code: PermissionEnum.CHARACTERIZATION,
      isContract: true,
      isMember: true,
      crud: 'cu',
    },
    {
      code: PermissionEnum.TASK,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  async browse(@Param() path: DeleteStatusPath) {
    return this.deleteStatusUseCase.execute({
      id: path.id,
      companyId: path.companyId,
    });
  }
}
