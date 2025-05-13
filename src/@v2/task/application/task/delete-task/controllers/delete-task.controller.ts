import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DeleteTaskUseCase } from '../use-cases/delete-task.usecase';
import { DeleteTaskPath } from './delete-task.path';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK.DELETE)
@UseGuards(JwtAuthGuard)
export class DeleteTaskController {
  constructor(private readonly deleteTaskUseCase: DeleteTaskUseCase) {}

  @Delete()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: DeleteTaskPath) {
    return this.deleteTaskUseCase.execute({
      id: path.id,
      companyId: path.companyId,
    });
  }
}
