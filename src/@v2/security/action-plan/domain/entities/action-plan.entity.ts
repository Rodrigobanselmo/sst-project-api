import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { ActionPlanStatusEnum } from '../enums/action-plan-status.enum';

export type IActionPlanEntity = {
  companyId: string;
  recommendationId: string;
  riskDataId: string;
  workspaceId: string;

  status: ActionPlanStatusEnum;
  startDate: Date | null;
  doneDate: Date | null;
  canceledDate?: Date | null;
  responsibleId?: number | null;
  validDate: Date | null;
};

export class ActionPlanEntity {
  companyId: string;
  recommendationId: string;
  readonly riskDataId: string;
  readonly workspaceId: string;

  _responsibleUpdatedAt?: Date | null;
  _responsibleId: number | null;
  _status: ActionPlanStatusEnum;
  _startDate: Date | null;
  _doneDate: Date | null;
  _canceledDate: Date | null;
  _validDate: Date | null;

  constructor(params: IActionPlanEntity) {
    this.companyId = params.companyId;
    this.recommendationId = params.recommendationId;
    this.riskDataId = params.riskDataId;
    this.workspaceId = params.workspaceId;

    this._responsibleId = params.responsibleId || null;
    this._status = params.status;
    this._startDate = params.startDate;
    this._doneDate = params.doneDate;
    this._canceledDate = params.canceledDate || null;
    this._validDate = params.validDate;
  }

  get responsibleId() {
    return this._responsibleId;
  }

  get responsibleUpdatedAt() {
    return this._responsibleUpdatedAt || null;
  }

  set responsibleId(responsibleId: number | null | undefined) {
    const oldResponsibleId = this._responsibleId;
    this._responsibleId = updateField(this._responsibleId, responsibleId);

    if (responsibleId && this._responsibleId !== oldResponsibleId) {
      this._responsibleUpdatedAt = new Date();
    }
  }

  get startDate() {
    return this._startDate;
  }

  get doneDate() {
    return this._doneDate;
  }

  get canceledDate() {
    return this._canceledDate;
  }

  get status() {
    return this._status;
  }

  get validDate() {
    return this._validDate;
  }
}
