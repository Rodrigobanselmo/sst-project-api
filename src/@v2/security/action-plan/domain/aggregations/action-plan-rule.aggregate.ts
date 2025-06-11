import { ActionPlanRuleEntity } from '../entities/action-plan-rule.entity';

export type IActionPlanRuleAggregate = {
  rule: ActionPlanRuleEntity;
  hierarchiesIds: string[];
  usersIds: number[];
  riskSubTypesIds: number[];
};

export class ActionPlanRuleAggregate {
  rule: ActionPlanRuleEntity;
  hierarchiesIds: string[];
  usersIds: number[];
  riskSubTypesIds: number[];

  constructor(params: IActionPlanRuleAggregate) {
    this.rule = params.rule;
    this.hierarchiesIds = params.hierarchiesIds || [];
    this.usersIds = params.usersIds || [];
    this.riskSubTypesIds = params.riskSubTypesIds || [];
  }

  get isAppliedToAllUser(): boolean {
    return this.usersIds.length === 0;
  }
}
