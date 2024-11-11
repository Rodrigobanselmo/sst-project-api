import { ActionPlanEntity } from "../../../domain/entities/action-plan.entity";
import { ActionPlanStatusEnum } from "../../../domain/enums/action-plan-status.enum";

export interface IActionPlanRepository {
  findById(params: IActionPlanRepository.FindByIdParams): IActionPlanRepository.FindByIdReturn
  update(params: IActionPlanRepository.UpdateParams): IActionPlanRepository.UpdateReturn
  updateMany(params: IActionPlanRepository.UpdateManyParams): IActionPlanRepository.UpdateManyReturn
}

export namespace IActionPlanRepository {
  export type FindByIdParams = { companyId: string; workspaceId: string; riskDataId: string; recommendationId: string; }
  export type FindByIdReturn = Promise<ActionPlanEntity | null>

  export type UpdateParams = ActionPlanEntity
  export type UpdateReturn = Promise<ActionPlanEntity | null>

  export type UpdateManyParams = ActionPlanEntity[]
  export type UpdateManyReturn = Promise<void>
}