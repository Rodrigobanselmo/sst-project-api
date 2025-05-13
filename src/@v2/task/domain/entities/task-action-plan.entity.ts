export type ITaskActionPlanEntity = {
  id?: string;
  companyId: string;
  recommendationId: string;
  riskDataId: string;
  workspaceId: string;
};

export class TaskActionPlanEntity {
  id: string;
  companyId: string;
  recommendationId: string;
  riskDataId: string;
  workspaceId: string;

  constructor(params: ITaskActionPlanEntity) {
    this.id = params.id || '-';
    this.companyId = params.companyId;
    this.recommendationId = params.recommendationId;
    this.riskDataId = params.riskDataId;
    this.workspaceId = params.workspaceId;
  }
}
