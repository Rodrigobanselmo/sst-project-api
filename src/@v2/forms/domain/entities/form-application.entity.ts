import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { FormStatusEnum } from '../enums/form-status.enum';
import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { errorCantChangeToPendingForm } from '../errors/domain.errors';
import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

type IUpdatePrams = {
  name?: string;
  description?: string | null;
};

export type FormApplicationEntityConstructor = {
  id?: string;
  name: string;
  description?: string;
  status?: FormStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  companyId: string;
  endedAt?: Date;
  startAt?: Date;
};

export class FormApplicationEntity {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  endedAt: Date | null;
  startAt?: Date;

  private _status: FormStatusEnum;

  constructor(params: FormApplicationEntityConstructor) {
    this.id = params.id || generateCuid();
    this.name = params.name;
    this.description = params.description || null;
    this._status = params.status ?? FormStatusEnum.PENDING;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.startAt = params.startAt;
    this.endedAt = params.endedAt || null;
    this.companyId = params.companyId;
  }

  get status() {
    return this._status;
  }

  get hasStarted() {
    return !!this.startAt;
  }

  setStatus(status?: FormStatusEnum): DomainResponse {
    if (!status) return [, null];
    if (status === this.status) return [, null];

    if (status === FormStatusEnum.PENDING) {
      return [, errorCantChangeToPendingForm];
    }

    const isFormBeingStarted = status === FormStatusEnum.PROGRESS;
    if (isFormBeingStarted) {
      if (!this.startAt) this.startAt = new Date();
    }

    const isFormBeingClosed = [FormStatusEnum.DONE, FormStatusEnum.CANCELED].includes(status);
    if (isFormBeingClosed) {
      if (!this.endedAt) this.endedAt = new Date();
    }

    const isFormBeingReopened = [FormStatusEnum.PROGRESS, FormStatusEnum.PENDING].includes(status);
    if (isFormBeingReopened) {
      this.endedAt = null;
    }

    this._status = status;
    return [, null];
  }

  update(data: IUpdatePrams) {
    this.name = updateField(this.name, data.name);
    this.description = updateField(this.description, data.description);
  }

  canBeAnswered() {
    return this.status === FormStatusEnum.PROGRESS;
  }
}
