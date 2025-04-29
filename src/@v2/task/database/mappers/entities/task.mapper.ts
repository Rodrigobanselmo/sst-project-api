import { TaskEntity } from '@/@v2/task/domain/entities/task.entity';
import { Task } from '@prisma/client';

export type ITaskEntityMapper = Task;

export class TaskMapper {
  static toEntity(data: ITaskEntityMapper): TaskEntity {
    return new TaskEntity({
      id: data.id,
      endDate: data.end_date,
      doneDate: data.done_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
      statusId: data.status_id,
      companyId: data.company_id,
      projectId: data.project_id,
      creatorId: data.creator_id,
      description: data.description,
    });
  }
}
