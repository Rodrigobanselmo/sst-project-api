import { ActionPlanModel } from '../../../domain/models/action-plan.model';

export namespace IActionPlanDao {
  export type FindManyParams = { ids: string[] };
  export type FindManyReturn = Promise<ActionPlanModel[]>;
}
