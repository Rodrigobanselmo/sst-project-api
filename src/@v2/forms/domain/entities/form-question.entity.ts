import { compareEntities } from '@/@v2/shared/domain/helpers/entity-diff.helper';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormQuestionEntityConstructor = {
  id?: string;
  required?: boolean;
  order: number;
  createdAt?: Date;
  deletedAt?: Date;
  groupId: string;
};

export class FormQuestionEntity {
  id: string;
  required: boolean;
  order: number;
  createdAt: Date;
  deletedAt?: Date;
  groupId: string;

  private _originalEntity: FormQuestionEntity;
  private _isNew: boolean;

  constructor(params: FormQuestionEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.required = params.required ?? false;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt;
    this.groupId = params.groupId;

    this._isNew = !params.id;
    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
  }

  get isNew() {
    return this._isNew;
  }

  update(params: { required?: boolean; order?: number }) {
    this.required = updateField(this.required, params.required);
    this.order = params.order || this.order;
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
}
