import { ActionPlanPhotoEntity } from '../entities/action-plan-photo.entity';
import { ActionPlanEntity } from '../entities/action-plan.entity';

export type IActionPlanPhotoAggregate = {
  actionPlan: ActionPlanEntity;
  photo: ActionPlanPhotoEntity;
};

export class ActionPlanPhotoAggregate {
  actionPlan: ActionPlanEntity;
  photo: ActionPlanPhotoEntity;

  constructor(params: IActionPlanPhotoAggregate) {
    this.actionPlan = params.actionPlan;
    this.photo = params.photo;
  }
}
