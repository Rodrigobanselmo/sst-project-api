import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { ActionPlanStatusEnum } from '../../enums/action-plan-status.enum';

export type IActionPlanBrowseRiskFilterParams = Partial<Record<RiskTypeEnum, { id: number; name: string }[]>>;

export type IActionPlanBrowseFilterModel = {
  status: ActionPlanStatusEnum[];
  workspaces: { id: string; name: string }[];
  riskTypes: IActionPlanBrowseRiskFilterParams;
};

export class ActionPlanBrowseFilterModel {
  status: ActionPlanStatusEnum[];
  workspaces: { id: string; name: string }[];
  riskTypes: IActionPlanBrowseRiskFilterParams;

  constructor(params: IActionPlanBrowseFilterModel) {
    this.status = params.status;
    this.workspaces = params.workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
    }));
    this.riskTypes = params.riskTypes || {};
  }
}
