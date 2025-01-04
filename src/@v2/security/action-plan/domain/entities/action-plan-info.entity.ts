import { updateField } from "@/@v2/shared/domain/helpers/update-field.helper";
import { CoordinatorEntity } from "./coordinator.entity";

export type IUpdateActionPlanInfoEntity = {
  validityStart?: Date
  validityEnd?: Date
  monthsLevel_2?: number;
  monthsLevel_3?: number;
  monthsLevel_4?: number;
  monthsLevel_5?: number;
}

export type IActionPlanInfoEntity = {
  companyId: string
  workspaceId: string
  validityStart: Date | null
  validityEnd: Date | null
  monthsLevel_2: number;
  monthsLevel_3: number;
  monthsLevel_4: number;
  monthsLevel_5: number;
}

export class ActionPlanInfoEntity {
  readonly companyId: string
  readonly workspaceId: string

  private _validityStart: Date | null
  private _validityEnd: Date | null
  private _monthsLevel_2: number;
  private _monthsLevel_3: number;
  private _monthsLevel_4: number;
  private _monthsLevel_5: number;

  constructor(params: IActionPlanInfoEntity) {
    this.companyId = params.companyId;
    this.workspaceId = params.workspaceId;
    this._validityStart = params.validityStart;
    this._validityEnd = params.validityEnd;
    this._monthsLevel_2 = params.monthsLevel_2;
    this._monthsLevel_3 = params.monthsLevel_3;
    this._monthsLevel_4 = params.monthsLevel_4;
    this._monthsLevel_5 = params.monthsLevel_5;
  }

  get validityStart() {
    return this._validityStart;
  }

  get validityEnd() {
    return this._validityEnd;
  }

  get monthsLevel_2() {
    return this._monthsLevel_2;
  }

  get monthsLevel_3() {
    return this._monthsLevel_3;
  }

  get monthsLevel_4() {
    return this._monthsLevel_4;
  }

  get monthsLevel_5() {
    return this._monthsLevel_5;
  }

  update(params: IUpdateActionPlanInfoEntity) {
    this._validityStart = updateField(this._validityStart, params.validityStart);
    this._validityEnd = updateField(this._validityEnd, params.validityEnd);
    this._monthsLevel_2 = params.monthsLevel_2 || this._monthsLevel_2
    this._monthsLevel_3 = params.monthsLevel_3 || this._monthsLevel_3
    this._monthsLevel_4 = params.monthsLevel_4 || this._monthsLevel_4
    this._monthsLevel_5 = params.monthsLevel_5 || this._monthsLevel_5
  }
}