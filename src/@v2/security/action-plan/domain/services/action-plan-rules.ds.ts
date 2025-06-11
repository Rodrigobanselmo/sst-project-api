import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { ActionPlanRuleAggregate } from '../aggregations/action-plan-rule.aggregate';
import { ActionPlanUserRulesVO, IActionPlanUserRulesVO } from '../values-objects/action-plan-user-rules';
import { ActionPlanInfoAggregate } from '../aggregations/action-plan-info.aggregate';

export class ActionPlanRulesDomainService {
  public static resolveUserPermissions(params: { userId: number; actionPlanRules: ActionPlanRuleAggregate[]; actionPlanInfo: ActionPlanInfoAggregate | null }): ActionPlanUserRulesVO {
    const isCoordinator = params.userId === params?.actionPlanInfo?.coordinator?.id;
    if (isCoordinator) return new ActionPlanUserRulesVO({});

    const applicableRules = params.actionPlanRules.filter((rule) => {
      const isDirectUserMatch = rule.usersIds.includes(params.userId);
      const isGlobalRule = rule.isAppliedToAllUser;
      return isDirectUserMatch || isGlobalRule;
    });

    const allowedHierarchyIds = new Set<string>();
    const allowedRiskTypes = new Set<RiskTypeEnum>();
    const allowedRiskSubTypeIds = new Set<number>();
    let hasAllowAllHierarchies = false;

    const restrictedHierarchyIds = new Set<string>();
    const restrictedRiskTypes = new Set<RiskTypeEnum>();
    const restrictedRiskSubTypeIds = new Set<number>();
    let hasRestrictAllHierarchies = false;

    for (const ruleAggregate of applicableRules) {
      const { rule, hierarchiesIds, riskSubTypesIds } = ruleAggregate;

      if (rule.isRestriction) {
        if (rule.isAllHierarchies) {
          hasRestrictAllHierarchies = true;
        }

        hierarchiesIds.forEach((id) => restrictedHierarchyIds.add(id));
        rule.riskTypes.forEach((type) => restrictedRiskTypes.add(type));
        riskSubTypesIds.forEach((id) => restrictedRiskSubTypeIds.add(id));
      } else {
        if (rule.isAllHierarchies) {
          hasAllowAllHierarchies = true;
        }

        hierarchiesIds.forEach((id) => allowedHierarchyIds.add(id));
        rule.riskTypes.forEach((type) => allowedRiskTypes.add(type));
        riskSubTypesIds.forEach((id) => allowedRiskSubTypeIds.add(id));
      }
    }

    const permissionsParams: IActionPlanUserRulesVO = {
      allowedHierarchyAccess: hasAllowAllHierarchies ? 'all' : Array.from(allowedHierarchyIds),
      allowedRiskType: Array.from(allowedRiskTypes),
      allowedRiskSubTypeIds: Array.from(allowedRiskSubTypeIds),

      restrictedHierarchyAccess: hasRestrictAllHierarchies ? 'all' : Array.from(restrictedHierarchyIds),
      restrictedRiskType: Array.from(restrictedRiskTypes),
      restrictedRiskSubTypeIds: Array.from(restrictedRiskSubTypeIds),
    };

    return new ActionPlanUserRulesVO(permissionsParams);
  }
}
