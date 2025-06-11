import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export type IActionPlanRuleEntity = {
  id: number;
  workspaceId: string;
  deletedAt?: Date | null;
  isRestriction?: boolean;
  isAllHierarchies?: boolean;
  riskTypes: RiskTypeEnum[];
};

export class ActionPlanRuleEntity {
  id: number;
  workspaceId: string;
  deletedAt: Date | null;
  isRestriction: boolean;
  isAllHierarchies?: boolean;
  riskTypes: RiskTypeEnum[];

  constructor(params: IActionPlanRuleEntity) {
    this.id = params.id;
    this.workspaceId = params.workspaceId;
    this.deletedAt = params.deletedAt || null;
    this.isRestriction = params.isRestriction || false;
    this.isAllHierarchies = params.isAllHierarchies || false;
    this.riskTypes = params.riskTypes;
  }
}
