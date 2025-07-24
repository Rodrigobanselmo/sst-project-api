import { FormTypeEnum } from '../enums/form-type.enum';
import { compareObjects } from '@/@v2/shared/domain/helpers/object-diff.helper';

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
  companyId: string;

  private _originalEntity: FormEntity;

  constructor(params: FormEntityConstructor) {
    this.id = params.id ?? 0;
    this.name = params.name;
    this.description = params.description;
    this.type = params.type ?? FormTypeEnum.NORMAL;
    this.anonymous = params.anonymous ?? false;
    this.shareableLink = params.shareableLink ?? false;
    this.system = params.system ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.companyId = params.companyId;

    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
  }

  clone() {
    return Object.assign({}, this);
  }

  diff() {
    return compareObjects(this._originalEntity, this);
  }
}
