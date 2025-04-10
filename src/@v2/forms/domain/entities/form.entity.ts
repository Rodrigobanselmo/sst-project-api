import { FormTypeEnum } from '../enums/form-type.enum';

export type FormEntityConstructor = {
  id?: number;
  name: string;
  description?: string;
  type?: FormTypeEnum;
  anonymous?: boolean;
  shareableLink?: boolean;
  system?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  companyId: string;
};

export class FormEntity {
  id: number;
  name: string;
  description?: string;
  type: FormTypeEnum;
  anonymous: boolean;
  shareableLink: boolean;
  system: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  companyId: string;

  constructor(params: FormEntityConstructor) {
    this.id = params.id ?? 0;
    this.name = params.name;
    this.description = params.description;
    this.type = params.type ?? FormTypeEnum.NORMAL;
    this.anonymous = params.anonymous ?? false;
    this.shareableLink = params.shareableLink ?? false;
    this.system = params.system ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
    this.companyId = params.companyId;
  }
}
