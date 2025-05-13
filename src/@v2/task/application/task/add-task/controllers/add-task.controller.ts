import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AddTaskUseCase } from '../use-cases/add-task.usecase';
import { AddTaskPath } from './add-task.path';
import { AddTaskPayload } from './add-task.payload';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK.ADD)
@UseGuards(JwtAuthGuard)
export class AddTaskController {
  constructor(private readonly addTaskUseCase: AddTaskUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: AddTaskPath, @Body() body: AddTaskPayload) {
    return this.addTaskUseCase.execute({
      companyId: path.companyId,
      actionPlan: body.actionPlan,
      description: body.description,
      doneDate: body.doneDate,
      photos: body.photos,
      endDate: body.endDate,
      responsible: body.responsible,
      statusId: body.statusId,
      projectId: body.projectId,
      priority: body.priority,
    });
  }
}
