import { FormStatusEnum } from '../enums/form-status.enum';

export type FormApplicationEntityConstructor = {
  id?: string;
  name: string;
  description?: string;
  status?: FormStatusEnum;
  shareableLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  companyId: string;
  formId: number;
  identifierGroupId: number;
};

export class FormApplicationEntity {
  id: string;
  name: string;
  description?: string;
  status: FormStatusEnum;
  shareableLink?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  companyId: string;
  formId: number;
  identifierGroupId: number;

  constructor(params: FormApplicationEntityConstructor) {
    this.id = params.id ?? '-';
    this.name = params.name;
    this.description = params.description;
    this.status = params.status ?? FormStatusEnum.PENDING;
    this.shareableLink = params.shareableLink;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
    this.companyId = params.companyId;
    this.formId = params.formId;
    this.identifierGroupId = params.identifierGroupId;
  }
}
