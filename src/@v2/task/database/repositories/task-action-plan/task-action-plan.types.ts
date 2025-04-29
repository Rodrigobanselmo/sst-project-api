import { TaskActionPlanEntity } from '@/@v2/task/domain/entities/task-action-plan.entity';

export namespace ITaskActionPlanRepository {
  export type CreateParams = TaskActionPlanEntity;
  export type CreateReturn = Promise<TaskActionPlanEntity | null>;

  export type UpdateParams = TaskActionPlanEntity;
  export type UpdateReturn = Promise<TaskActionPlanEntity | null>;

  export type FindParams = { companyId: string; recommendationId: string; riskDataId: string; workspaceId: string };
  export type FindReturn = Promise<TaskActionPlanEntity | null>;
}
