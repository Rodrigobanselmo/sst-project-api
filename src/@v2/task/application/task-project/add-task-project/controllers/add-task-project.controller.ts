import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AddTaskProjectUseCase } from '../use-cases/add-task-project.usecase';
import { AddTaskProjectPath } from './add-task-project.path';
import { AddTaskProjectPayload } from './add-task-project.payload';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK_PROJECT.ADD)
@UseGuards(JwtAuthGuard)
export class AddTaskProjectController {
  constructor(private readonly addTaskProjectUseCase: AddTaskProjectUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: AddTaskProjectPath, @Body() body: AddTaskProjectPayload) {
    return this.addTaskProjectUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      description: body.description,
      members: body.members,
    });
  }
}
