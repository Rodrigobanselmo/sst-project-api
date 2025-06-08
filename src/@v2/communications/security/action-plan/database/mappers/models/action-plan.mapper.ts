import { StatusEnum } from '@prisma/client';
import { ActionPlanModel } from '../../../domain/models/action-plan.model';
import { ActionPlanStatusEnum } from '../../../domain/enums/action-plan-status.enum';

export type IActionPlanModelMapper = {
  id: string;
  endDate: Date;
  status: StatusEnum;
  recMed: {
    recName: string;
  };
};

export class ActionPlanModelMapper {
  static toModel(data: IActionPlanModelMapper): ActionPlanModel {
    return new ActionPlanModel({
      id: data.id,
      dueDate: new Date(data.endDate),
      title: data.recMed?.recName || '',
      status: ActionPlanStatusEnum[data.status],
    });
  }

  static toModels(data: IActionPlanModelMapper[]): ActionPlanModel[] {
    return data.map((item) => this.toModel(item));
  }
}
