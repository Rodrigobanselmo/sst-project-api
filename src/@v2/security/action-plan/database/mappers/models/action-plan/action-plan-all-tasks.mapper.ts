import { ActionPlanAllTasksModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-all-tasks.model';

export type IActionPlanAllTasksMapper = {
  company_id: string;
  responsible_id: number;
  ids: string[];
};

export class ActionPlanAllTasksMapper {
  static toModel(params: IActionPlanAllTasksMapper): ActionPlanAllTasksModel {
    return new ActionPlanAllTasksModel({
      companyId: params.company_id,
      responsibleId: Number(params.responsible_id),
      ids: params.ids || [],
    });
  }

  static toModels(data: IActionPlanAllTasksMapper[]): ActionPlanAllTasksModel[] {
    return data.map((ActionPlan) => this.toModel(ActionPlan));
  }
}
