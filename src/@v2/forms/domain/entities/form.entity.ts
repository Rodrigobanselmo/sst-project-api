import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';
import { FormTypeEnum } from '../enums/form-type.enum';
import { compareEntities } from '@/@v2/shared/domain/helpers/entity-diff.helper';

export type FormEntityConstructor = {
  id?: string;
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
  id: string;
  name: string;
  description?: string;
  type: FormTypeEnum;
  anonymous: boolean;
  shareableLink: boolean;
  system: boolean;
  createdAt: Date;
  companyId: string;

  private _originalEntity: FormEntity;
  private _isNew: boolean;

  constructor(params: FormEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.name = params.name;
    this.description = params.description;
    this.type = params.type ?? FormTypeEnum.NORMAL;
    this.anonymous = params.anonymous ?? false;
    this.shareableLink = params.shareableLink ?? false;
    this.system = params.system ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.companyId = params.companyId;

    this._isNew = !params.id;
    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
  }

  get isNew() {
    return this._isNew;
  }

  clone() {
    return Object.assign({}, this);
  }

  diff() {
    return compareEntities(this._originalEntity, this, { keysToCompare: Object.keys(this._originalEntity) });
  }
}
