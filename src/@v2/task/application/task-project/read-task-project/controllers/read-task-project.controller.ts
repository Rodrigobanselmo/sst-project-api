import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { TaskRoutes } from '@/@v2/task/constants/routes';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadTaskProjectUseCase } from '../use-cases/read-task-project.usecase';
import { ReadTaskProjectPath } from './read-task-project.path';

@Controller(TaskRoutes.TASK_PROJECT.READ)
@UseGuards(JwtAuthGuard)
export class ReadTaskProjectController {
  constructor(private readonly readTaskProjectUseCase: ReadTaskProjectUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async read(@Param() path: ReadTaskProjectPath) {
    return this.readTaskProjectUseCase.execute({
      companyId: path.companyId,
      id: path.id,
    });
  }
}
