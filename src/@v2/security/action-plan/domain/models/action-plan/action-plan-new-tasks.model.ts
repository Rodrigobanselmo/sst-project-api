export type IActionPlanNewTasksModel = {
  companyId: string;
  responsibleId: number;
  ids: string[];
};

export class ActionPlanNewTasksModel {
  companyId: string;
  responsibleId: number;
  ids: string[];

  constructor(params: IActionPlanNewTasksModel) {
    this.companyId = params.companyId;
    this.responsibleId = params.responsibleId;
    this.ids = params.ids;
  }
}
