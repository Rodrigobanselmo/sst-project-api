import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { TaskRoutes } from '@/@v2/task/constants/routes';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditTaskProjectUseCase } from '../use-cases/edit-task-project.usecase';
import { EditTaskProjectPath } from './edit-task-project.path';
import { EditTaskProjectPayload } from './edit-task-project.payload';

@Controller(TaskRoutes.TASK_PROJECT.EDIT)
@UseGuards(JwtAuthGuard)
export class EditTaskProjectController {
  constructor(private readonly editTaskProjectUseCase: EditTaskProjectUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.TASK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: EditTaskProjectPath, @Body() body: EditTaskProjectPayload) {
    return this.editTaskProjectUseCase.execute({
      id: path.id,
      companyId: path.companyId,
      name: body.name,
      description: body.description,
      members: body.members,
      status: body.status,
    });
  }
}
