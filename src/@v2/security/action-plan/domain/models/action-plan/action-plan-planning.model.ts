export type IActionPlanPlanningModel = {
  monitoringMethod: string | null;
  resultCriteria: string | null;
};

export class ActionPlanPlanningModel {
  monitoringMethod: string | null;
  resultCriteria: string | null;

  constructor(params: IActionPlanPlanningModel) {
    this.monitoringMethod = params.monitoringMethod;
    this.resultCriteria = params.resultCriteria;
  }
}
