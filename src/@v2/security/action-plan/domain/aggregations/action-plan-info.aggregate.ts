import { updateField } from "@/@v2/shared/domain/helpers/update-field.helper";
import { ActionPlanInfoEntity } from "../entities/action-plan-info.entity";
import { CoordinatorEntity } from "../entities/coordinator.entity";

export type IActionPlanInfoAggregate = {
  actionPlanInfo: ActionPlanInfoEntity
  coordinator: CoordinatorEntity | null
}

export class ActionPlanInfoAggregate {
  actionPlanInfo: ActionPlanInfoEntity
  private _coordinator: CoordinatorEntity | null

  constructor(params: IActionPlanInfoAggregate) {
    this.actionPlanInfo = params.actionPlanInfo;
    this._coordinator = params.coordinator;
  }

  get coordinator() {
    return this._coordinator;
  }

  set coordinator(coordinator: CoordinatorEntity | null | undefined) {
    this._coordinator = updateField(this._coordinator, coordinator);
  }
}