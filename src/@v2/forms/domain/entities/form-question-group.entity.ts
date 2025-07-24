import { compareObjects } from '@/@v2/shared/domain/helpers/object-diff.helper';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

export type FormQuestionGroupEntityConstructor = {
  id?: number;
  name: string;
  description?: string;
  order: number;
  createdAt?: Date;
  deletedAt?: Date | null;
  formId: number;
};

export class FormQuestionGroupEntity {
  id: number;
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  deletedAt: Date | null;
  formId: number;

  private _originalEntity: FormQuestionGroupEntity;

  constructor(params: FormQuestionGroupEntityConstructor) {
    this.id = params.id ?? 0;
    this.name = params.name;
    this.description = params.description;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
    this.formId = params.formId;

    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
  }

  delete() {
    this.deletedAt = new Date();
  }

  clone() {
    return Object.assign({}, this);
  }

  update(params: { name: string; description?: string; order: number }) {
    this.name = params.name || this.name;
    this.order = params.order || this.order;
    this.description = updateField(this.description, params.description);
  }

  diff() {
    return compareObjects(this._originalEntity, this);
  }
}
