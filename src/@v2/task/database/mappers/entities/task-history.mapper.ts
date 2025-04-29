import { TaskHistoryEntity } from '@/@v2/task/domain/entities/task-history.entity';
import { TaskHistory } from '@prisma/client';

export type ITaskHistoryEntityMapper = TaskHistory;

export class TaskHistoryMapper {
  static toEntity(data: ITaskHistoryEntityMapper): TaskHistoryEntity {
    return new TaskHistoryEntity({
      id: data.id,
      text: data.text,
      changes: data.changes as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
    });
  }

  static toEntities(data: ITaskHistoryEntityMapper[]): TaskHistoryEntity[] {
    return data.map((item) => this.toEntity(item));
  }
}
