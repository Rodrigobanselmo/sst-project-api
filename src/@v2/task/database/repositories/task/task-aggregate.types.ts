import { TaskAggregate } from '@/@v2/task/domain/aggregations/task.aggregate';

export namespace ITaskAggregateRepository {
  export type CreateParams = TaskAggregate;
  export type CreateReturn = Promise<TaskAggregate | null>;

  export type UpdateParams = TaskAggregate;
  export type UpdateReturn = Promise<TaskAggregate | null>;

  export type UpdateManyParams = TaskAggregate[];
  export type UpdateManyReturn = Promise<void>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<TaskAggregate | null>;
}
