import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DeleteTaskProjectUseCase } from '../use-cases/delete-task-project.usecase';
import { DeleteTaskProjectPath } from './delete-task-project.path';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK_PROJECT.DELETE)
@UseGuards(JwtAuthGuard)
export class DeleteTaskProjectController {
  constructor(private readonly deleteTaskProjectUseCase: DeleteTaskProjectUseCase) {}

  @Delete()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: DeleteTaskProjectPath) {
    return this.deleteTaskProjectUseCase.execute({
      id: path.id,
      companyId: path.companyId,
    });
  }
}
