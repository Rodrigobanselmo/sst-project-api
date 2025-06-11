import { RiskFactorsEnum } from '@prisma/client';
import { ActionPlanRuleEntity } from '../../../domain/entities/action-plan-rule.entity';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export type IActionPlanRuleEntityMapper = {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  is_restriction: boolean;
  is_all_hierarchies: boolean;
  workspace_id: string;
  risk_types: RiskFactorsEnum[];
};

export class ActionPlanRuleEntityMapper {
  static toEntity(prisma: IActionPlanRuleEntityMapper): ActionPlanRuleEntity {
    return new ActionPlanRuleEntity({
      id: prisma.id,
      workspaceId: prisma.workspace_id,
      deletedAt: prisma.deleted_at,
      isRestriction: prisma.is_restriction,
      isAllHierarchies: prisma.is_all_hierarchies,
      riskTypes: prisma.risk_types.map((type) => RiskTypeEnum[type]),
    });
  }
}
