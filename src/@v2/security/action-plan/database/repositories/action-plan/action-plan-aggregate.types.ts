import { ActionPlanAggregate } from '../../../domain/aggregations/action-plan.aggregate';

export interface IActionPlanAggregateRepository {
  findById(params: IActionPlanAggregateRepository.FindByIdParams): IActionPlanAggregateRepository.FindByIdReturn;
  update(params: IActionPlanAggregateRepository.UpdateParams): IActionPlanAggregateRepository.UpdateReturn;
  updateMany(params: IActionPlanAggregateRepository.UpdateManyParams): IActionPlanAggregateRepository.UpdateManyReturn;
}

export namespace IActionPlanAggregateRepository {
  export type SelectOptionsParams = { companyId: string; workspaceId: string; riskDataId: string; recommendationId: string };
  export type FindByIdParams = { companyId: string; workspaceId: string; riskDataId: string; recommendationId: string };
  export type FindByIdReturn = Promise<ActionPlanAggregate | null>;

  export type UpdateParams = ActionPlanAggregate;
  export type UpdateReturn = Promise<void>;

  export type UpdateManyParams = ActionPlanAggregate[];
  export type UpdateManyReturn = Promise<void>;
}
