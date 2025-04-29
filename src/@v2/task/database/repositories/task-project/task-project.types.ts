import { TaskProjectEntity } from '@/@v2/task/domain/entities/task-project.entity';

export namespace ITaskProjectRepository {
  export type CreateParams = TaskProjectEntity;
  export type CreateReturn = Promise<TaskProjectEntity | null>;

  export type UpdateParams = TaskProjectEntity;
  export type UpdateReturn = Promise<TaskProjectEntity | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<TaskProjectEntity | null>;
}
