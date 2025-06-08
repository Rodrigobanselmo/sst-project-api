import { ActionPlanStatusEnum } from '../enums/action-plan-status.enum';

export type IActionPlanModel = {
  id: string;
  title: string;
  dueDate: Date;
  status: ActionPlanStatusEnum;
};

export class ActionPlanModel {
  id: string;
  title: string;
  dueDate: Date;
  status: ActionPlanStatusEnum;

  constructor(params: IActionPlanModel) {
    this.id = params.id;
    this.title = params.title;
    this.dueDate = params.dueDate;
    this.status = params.status;
  }
}
