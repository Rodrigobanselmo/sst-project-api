import { compareObjects } from '@/@v2/shared/domain/helpers/object-diff.helper';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

export type FormQuestionOptionEntityConstructor = {
  id?: number;
  text: string;
  order: number;
  value?: number;
  createdAt?: Date;
  deletedAt?: Date;
};

export class FormQuestionOptionEntity {
  id: number;
  text: string;
  order: number;
  value?: number;
  createdAt: Date;
  deletedAt?: Date;

  private _originalEntity: FormQuestionOptionEntity;

  constructor(params: FormQuestionOptionEntityConstructor) {
    this.id = params.id ?? 0;
    this.text = params.text;
    this.order = params.order;
    this.value = params.value;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt;

    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
  }

  update(params: { text?: string; value?: number; order?: number }) {
    this.text = params.text || this.text;
    this.value = updateField(this.value, params.value);
    this.order = params.order || this.order;
  }

  clone() {
    return Object.assign({}, this);
  }

  diff() {
    return compareObjects(this._originalEntity, this);
  }
}
