import { ActionPlanRuleAggregate } from '../../../domain/aggregations/action-plan-rule.aggregate';
import { ActionPlanRuleEntityMapper, IActionPlanRuleEntityMapper } from '../entities/action-plan-rule.mapper';

type IActionPlanRuleAggregateMapper = IActionPlanRuleEntityMapper & {
  riskSubTypes: {
    risk_sub_type_id: number;
  }[];
  hierarchies: {
    hierarchy_id: string;
  }[];
  users: {
    user_id: number;
  }[];
};

export class ActionPlanRuleAggregateMapper {
  static toAggregate(data: IActionPlanRuleAggregateMapper): ActionPlanRuleAggregate {
    return new ActionPlanRuleAggregate({
      rule: ActionPlanRuleEntityMapper.toEntity(data),
      hierarchiesIds: data.hierarchies.map((h) => h.hierarchy_id),
      usersIds: data.users.map((u) => u.user_id),
      riskSubTypesIds: data.riskSubTypes.map((r) => r.risk_sub_type_id),
    });
  }

  static toAggregates(data: IActionPlanRuleAggregateMapper[]): ActionPlanRuleAggregate[] {
    return data.map((item) => this.toAggregate(item));
  }
}
