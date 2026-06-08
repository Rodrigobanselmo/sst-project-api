import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { ActionPlanStatusEnum } from '../enums/action-plan-status.enum';
import { EffectivenessStatusEnum } from '../enums/effectiveness-status.enum';

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
  monitoringMethod?: string | null;
  resultCriteria?: string | null;
  effectivenessStatus?: EffectivenessStatusEnum;
  effectivenessDate?: Date | null;
  effectivenessComment?: string | null;
  effectivenessById?: number | null;
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
  _monitoringMethod: string | null;
  _resultCriteria: string | null;
  _effectivenessStatus: EffectivenessStatusEnum;
  _effectivenessDate: Date | null;
  _effectivenessComment: string | null;
  _effectivenessById: number | null;

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
    this._monitoringMethod = params.monitoringMethod ?? null;
    this._resultCriteria = params.resultCriteria ?? null;
    this._effectivenessStatus = params.effectivenessStatus ?? EffectivenessStatusEnum.NOT_EVALUATED;
    this._effectivenessDate = params.effectivenessDate ?? null;
    this._effectivenessComment = params.effectivenessComment ?? null;
    this._effectivenessById = params.effectivenessById ?? null;
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

  get monitoringMethod() {
    return this._monitoringMethod;
  }

  get resultCriteria() {
    return this._resultCriteria;
  }

  get effectivenessStatus() {
    return this._effectivenessStatus;
  }

  get effectivenessDate() {
    return this._effectivenessDate;
  }

  get effectivenessComment() {
    return this._effectivenessComment;
  }

  get effectivenessById() {
    return this._effectivenessById;
  }
}
