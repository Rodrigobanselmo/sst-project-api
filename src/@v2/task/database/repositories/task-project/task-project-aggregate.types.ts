import { TaskProjectAggregate } from '@/@v2/task/domain/aggregations/task-project.aggregate';

export namespace ITaskProjectRepository {
  export type CreateParams = TaskProjectAggregate;
  export type CreateReturn = Promise<TaskProjectAggregate | null>;

  export type UpdateParams = TaskProjectAggregate;
  export type UpdateReturn = Promise<TaskProjectAggregate | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<TaskProjectAggregate | null>;
}
