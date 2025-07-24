import { compareObjects } from '@/@v2/shared/domain/helpers/object-diff.helper';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

export type FormQuestionEntityConstructor = {
  id?: number;
  required?: boolean;
  order: number;
  createdAt?: Date;
  deletedAt?: Date;
};

export class FormQuestionEntity {
  id: number;
  required: boolean;
  order: number;
  createdAt: Date;
  deletedAt?: Date;

  private _originalEntity: FormQuestionEntity;

  constructor(params: FormQuestionEntityConstructor) {
    this.id = params.id ?? 0;
    this.required = params.required ?? false;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt;

    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
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
    return compareObjects(this._originalEntity, this);
  }
}
