import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditManyTaskUseCase } from '../use-cases/edit-many-task.usecase';
import { EditManyTaskPath } from './edit-many-task.path';
import { EditManyTaskPayload } from './edit-many-task.payload';
import { TaskRoutes } from '@/@v2/task/constants/routes';

@Controller(TaskRoutes.TASK.EDIT_MANY)
@UseGuards(JwtAuthGuard)
export class EditManyTaskController {
  constructor(private readonly editManyTaskUseCase: EditManyTaskUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: EditManyTaskPath, @Body() body: EditManyTaskPayload) {
    return this.editManyTaskUseCase.execute({
      companyId: path.companyId,
      ids: body.ids,
      endDate: body.endDate,
      actionPlan: body.actionPlan,
      description: body.description,
      doneDate: body.doneDate,
      projectId: body.projectId,
      responsible: body.responsible,
      statusId: body.statusId,
      priority: body.priority,
    });
  }
}
