import { ActionPlanPhotoAggregate } from '../../../domain/aggregations/action-plan-photo.aggregate';

export interface IActionPlanPhotoAggregateRepository {
  find(params: IActionPlanPhotoAggregateRepository.FindParams): IActionPlanPhotoAggregateRepository.FindReturn;
  update(params: IActionPlanPhotoAggregateRepository.UpdateParams): IActionPlanPhotoAggregateRepository.UpdateReturn;
  create(params: IActionPlanPhotoAggregateRepository.CreateParams): IActionPlanPhotoAggregateRepository.CreateReturn;
  inactivate(params: IActionPlanPhotoAggregateRepository.InactivateParams): IActionPlanPhotoAggregateRepository.InactivateReturn;
}

export namespace IActionPlanPhotoAggregateRepository {
  export type SelectOptionsParams = { workspaceId: string };

  export type FindParams = { companyId: string; id: string };
  export type FindReturn = Promise<ActionPlanPhotoAggregate | null>;

  export type CreateParams = ActionPlanPhotoAggregate;
  export type CreateReturn = Promise<boolean | null>;

  export type UpdateParams = ActionPlanPhotoAggregate;
  export type UpdateReturn = Promise<boolean | null>;

  export type InactivateParams = ActionPlanPhotoAggregate;
  export type InactivateReturn = Promise<boolean | null>;
}
