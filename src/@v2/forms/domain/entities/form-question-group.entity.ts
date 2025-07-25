import { compareEntities } from '@/@v2/shared/domain/helpers/entity-diff.helper';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormQuestionGroupEntityConstructor = {
  id?: string;
  name: string;
  description?: string;
  order: number;
  createdAt?: Date;
  deletedAt?: Date | null;
  formId: string;
};

export class FormQuestionGroupEntity {
  id: string;
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  deletedAt: Date | null;
  formId: string;

  private _originalEntity: FormQuestionGroupEntity;
  private _isNew: boolean;

  constructor(params: FormQuestionGroupEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.name = params.name;
    this.description = params.description;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
    this.formId = params.formId;

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

  update(params: { name: string; description?: string; order: number }) {
    this.name = params.name || this.name;
    this.order = params.order || this.order;
    this.description = updateField(this.description, params.description);
  }

  diff() {
    return compareEntities(this._originalEntity, this, { keysToCompare: Object.keys(this._originalEntity) });
  }
}
