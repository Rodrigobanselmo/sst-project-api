export type IActionPlanAllTasksModel = {
  companyId: string;
  responsibleId: number;
  ids: string[];
};

export class ActionPlanAllTasksModel {
  companyId: string;
  responsibleId: number;
  ids: string[];

  constructor(params: IActionPlanAllTasksModel) {
    this.companyId = params.companyId;
    this.responsibleId = params.responsibleId;
    this.ids = params.ids;
  }
}
