import { ActionPlanRuleAggregate } from '../../../domain/aggregations/action-plan-rule.aggregate';

export interface IActionPlanRuleAggregateRepository {
  findMany(params: IActionPlanRuleAggregateRepository.FindManyParams): IActionPlanRuleAggregateRepository.FindManyReturn;
  update(params: IActionPlanRuleAggregateRepository.UpdateParams): IActionPlanRuleAggregateRepository.UpdateReturn;
  create(params: IActionPlanRuleAggregateRepository.CreateParams): IActionPlanRuleAggregateRepository.CreateReturn;
}

export namespace IActionPlanRuleAggregateRepository {
  export type FindManyParams = { companyId: string; workspaceId: string };
  export type FindManyReturn = Promise<ActionPlanRuleAggregate[]>;

  export type CreateParams = ActionPlanRuleAggregate;
  export type CreateReturn = Promise<ActionPlanRuleAggregate | null>;

  export type UpdateParams = ActionPlanRuleAggregate;
  export type UpdateReturn = Promise<ActionPlanRuleAggregate | null>;
}
