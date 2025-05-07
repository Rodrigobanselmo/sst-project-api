import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditTaskUseCase } from '../use-cases/edit-task.usecase';
import { EditTaskPath } from './edit-task.path';
import { EditTaskPayload } from './edit-task.payload';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK.EDIT)
@UseGuards(JwtAuthGuard)
export class EditTaskController {
  constructor(private readonly editTaskUseCase: EditTaskUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: EditTaskPath, @Body() body: EditTaskPayload) {
    return this.editTaskUseCase.execute({
      id: path.id,
      companyId: path.companyId,
      endDate: body.endDate,
      actionPlan: body.actionPlan,
      description: body.description,
      doneDate: body.doneDate,
      photos: body.photos,
      projectId: body.projectId,
      responsible: body.responsible,
      statusId: body.statusId,
      priority: body.priority,
    });
  }
}
