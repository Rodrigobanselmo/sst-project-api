import { TaskProjectEntity } from '@/@v2/task/domain/entities/task-project.entity';
import { TaskProjectStatusEnum } from '@/@v2/task/domain/enums/task-project-status.enum';
import { TaskProject } from '@prisma/client';

export type ITaskProjectEntityMapper = TaskProject;

export class TaskProjectMapper {
  static toEntity(data: ITaskProjectEntityMapper): TaskProjectEntity {
    return new TaskProjectEntity({
      id: data.id,
      companyId: data.company_id,
      name: data.name,
      description: data.description,
      status: TaskProjectStatusEnum[data.status],
      userId: data.user_id,
    });
  }
}
