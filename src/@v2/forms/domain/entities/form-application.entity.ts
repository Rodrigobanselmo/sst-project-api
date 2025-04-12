import { FormStatusEnum } from '../enums/form-status.enum';

export type FormApplicationEntityConstructor = {
  id?: string;
  name: string;
  description?: string;
  status?: FormStatusEnum;
  shareableLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
  companyId: string;
  endedAt?: Date;
  startAt?: Date;
};

export class FormApplicationEntity {
  id: string;
  name: string;
  description?: string;
  status: FormStatusEnum;
  shareableLink?: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  endedAt?: Date;
  startAt?: Date;

  constructor(params: FormApplicationEntityConstructor) {
    this.id = params.id ?? '-';
    this.name = params.name;
    this.description = params.description;
    this.status = params.status ?? FormStatusEnum.PENDING;
    this.shareableLink = params.shareableLink;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.startAt = params.startAt;
    this.endedAt = params.endedAt;
    this.companyId = params.companyId;
  }
}
