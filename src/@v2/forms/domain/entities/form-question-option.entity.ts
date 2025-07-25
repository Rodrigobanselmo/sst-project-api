import { compareEntities } from '@/@v2/shared/domain/helpers/entity-diff.helper';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormQuestionOptionEntityConstructor = {
  id?: string;
  text: string;
  order: number;
  value?: number;
  createdAt?: Date;
  deletedAt?: Date;
};

export class FormQuestionOptionEntity {
  id: string;
  text: string;
  order: number;
  value?: number;
  createdAt: Date;
  deletedAt?: Date;

  private _originalEntity: FormQuestionOptionEntity;
  private _isNew: boolean;

  constructor(params: FormQuestionOptionEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.text = params.text;
    this.order = params.order;
    this.value = params.value;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt;

    this._isNew = !params.id;
    this._originalEntity = this.clone();
  }

  get isNew() {
    return this._isNew;
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
    return compareEntities(this._originalEntity, this, { keysToCompare: Object.keys(this._originalEntity) });
  }
}
