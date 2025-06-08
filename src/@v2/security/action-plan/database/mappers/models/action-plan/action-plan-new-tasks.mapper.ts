import { ActionPlanNewTasksModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-new-tasks.model';

export type IActionPlanNewTasksMapper = {
  company_id: string;
  responsible_id: number;
  ids: string[];
};

export class ActionPlanNewTasksMapper {
  static toModel(params: IActionPlanNewTasksMapper): ActionPlanNewTasksModel {
    return new ActionPlanNewTasksModel({
      companyId: params.company_id,
      responsibleId: Number(params.responsible_id),
      ids: params.ids || [],
    });
  }

  static toModels(data: IActionPlanNewTasksMapper[]): ActionPlanNewTasksModel[] {
    return data.map((ActionPlan) => this.toModel(ActionPlan));
  }
}
