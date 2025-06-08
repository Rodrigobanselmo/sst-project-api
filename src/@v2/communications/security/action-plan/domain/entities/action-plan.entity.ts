export type IActionPlanEntity = {
  id: string;
  title: string;
  dueDate: Date;
};

export class ActionPlanEntity {
  id: string;
  title: string;
  dueDate: Date;

  constructor(params: IActionPlanEntity) {
    this.id = params.id;
    this.title = params.title;
    this.dueDate = params.dueDate;
  }
}
