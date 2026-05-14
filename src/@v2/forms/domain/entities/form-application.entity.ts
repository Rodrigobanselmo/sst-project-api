import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { FormStatusEnum } from '../enums/form-status.enum';
import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { errorCantChangeToPendingForm } from '../errors/domain.errors';
import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

type IUpdatePrams = {
  name?: string;
  description?: string | null;
  anonymous?: boolean | null;
  shareableLink?: boolean | null;
  participationGoal?: number | null;
  bannerIntroText?: string | null;
  bannerWhyText?: string | null;
  bannerContactText?: string | null;
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
  anonymous?: boolean | null;
  shareableLink?: boolean | null;
  participationGoal?: number | null;
  bannerIntroText?: string | null;
  bannerWhyText?: string | null;
  bannerContactText?: string | null;
  reminderCount?: number;
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
  anonymous: boolean | null;
  shareableLink: boolean | null;
  participationGoal: number | null;
  bannerIntroText: string | null;
  bannerWhyText: string | null;
  bannerContactText: string | null;
  reminderCount: number;

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
    this.anonymous = params.anonymous ?? null;
    this.shareableLink = params.shareableLink ?? null;
    this.participationGoal = params.participationGoal ?? null;
    this.bannerIntroText = params.bannerIntroText ?? null;
    this.bannerWhyText = params.bannerWhyText ?? null;
    this.bannerContactText = params.bannerContactText ?? null;
    this.reminderCount = params.reminderCount ?? 0;
  }

  get status() {
    return this._status;
  }

  get hasStarted() {
    if (this.status === FormStatusEnum.INACTIVE) return false;
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
    console.log({ data, this: this.shareableLink });
    this.name = updateField(this.name, data.name);
    this.description = updateField(this.description, data.description);
    this.anonymous = updateField(this.anonymous, data.anonymous);
    this.shareableLink = updateField(this.shareableLink, data.shareableLink);
    this.participationGoal = updateField(this.participationGoal, data.participationGoal);
    this.bannerIntroText = updateField(this.bannerIntroText, data.bannerIntroText);
    this.bannerWhyText = updateField(this.bannerWhyText, data.bannerWhyText);
    this.bannerContactText = updateField(this.bannerContactText, data.bannerContactText);
  }

  canBeAnswered() {
    return this.isPublic || this.isTesting;
  }

  get isPublic() {
    return this.status === FormStatusEnum.PROGRESS;
  }

  get isTesting() {
    return this.status === FormStatusEnum.TESTING;
  }
}
