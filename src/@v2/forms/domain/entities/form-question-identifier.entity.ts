import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';
import { FormIdentifierTypeEnum } from '../enums/form-identifier-type.enum';
import { compareEntities } from '@/@v2/shared/domain/helpers/entity-diff.helper';

export type FormQuestionIdentifierEntityConstructor = {
  id?: string;
  system: boolean;
  directAssociation?: boolean;
  type: FormIdentifierTypeEnum;
  createdAt?: Date;
  deletedAt?: Date;
};

export class FormQuestionIdentifierEntity {
  id: string;
  directAssociation: boolean;
  system: boolean;
  type: FormIdentifierTypeEnum;
  createdAt: Date;
  deletedAt?: Date;

  private _originalEntity: FormQuestionIdentifierEntity;
  private _isNew: boolean;

  constructor(params: FormQuestionIdentifierEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.directAssociation = params.directAssociation ?? false;
    this.system = params.system;
    this.type = params.type;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt;

    this._isNew = !params.id;
    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
  }

  get isNew() {
    return this._isNew;
  }

  delete() {
    this.deletedAt = new Date();
  }

  clone() {
    return Object.assign({}, this);
  }

  diff() {
    return compareEntities(this._originalEntity, this, { keysToCompare: Object.keys(this._originalEntity) });
  }

  update(params: { directAssociation?: boolean; type?: FormIdentifierTypeEnum }) {
    this.directAssociation = params.directAssociation ?? this.directAssociation;
    this.type = params.type ?? this.type;
  }
}
