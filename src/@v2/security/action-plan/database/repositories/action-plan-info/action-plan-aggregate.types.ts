import { ActionPlanInfoAggregate } from '../../../domain/aggregations/action-plan-info.aggregate';

export interface IActionPlanInfoAggregateRepository {
  findById(params: IActionPlanInfoAggregateRepository.FindByIdParams): IActionPlanInfoAggregateRepository.FindByIdReturn;
  update(params: IActionPlanInfoAggregateRepository.UpdateParams): IActionPlanInfoAggregateRepository.UpdateReturn;
  create(params: IActionPlanInfoAggregateRepository.CreateParams): IActionPlanInfoAggregateRepository.CreateReturn;
}

export namespace IActionPlanInfoAggregateRepository {
  export type FindByIdParams = { companyId: string; workspaceId: string };
  export type FindByIdReturn = Promise<ActionPlanInfoAggregate | null>;

  export type CreateParams = ActionPlanInfoAggregate;
  export type CreateReturn = Promise<ActionPlanInfoAggregate | null>;

  export type UpdateParams = ActionPlanInfoAggregate;
  export type UpdateReturn = Promise<ActionPlanInfoAggregate | null>;
}
