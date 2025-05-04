import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { TaskRoutes } from '@/@v2/task/constants/routes';
import { ReadTaskUseCase } from '../use-cases/read-task.usecase';
import { ReadTaskPath } from './read-task.path';

@Controller(TaskRoutes.TASK.READ)
@UseGuards(JwtAuthGuard)
export class ReadTaskController {
  constructor(private readonly readTaskUseCase: ReadTaskUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async read(@Param() path: ReadTaskPath) {
    return this.readTaskUseCase.execute({
      companyId: path.companyId,
      id: path.id,
    });
  }
}
