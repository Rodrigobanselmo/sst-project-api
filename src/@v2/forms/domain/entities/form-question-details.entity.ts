import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { FormQuestionTypeEnum } from '../enums/form-question-type.enum';
import { compareEntities } from '@/@v2/shared/domain/helpers/entity-diff.helper';
import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormQuestionDetailsEntityConstructor = {
  id?: string;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  companyId: string;
};

export class FormQuestionDetailsEntity {
  id: string;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther: boolean;
  system: boolean;
  createdAt: Date;
  deletedAt?: Date;
  companyId: string;

  private _originalEntity: FormQuestionDetailsEntity;
  private _isNew: boolean;

  constructor(params: FormQuestionDetailsEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.text = params.text;
    this.type = params.type;
    this.acceptOther = params.acceptOther ?? false;
    this.system = params.system ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt;
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

  update(params: { text?: string; type?: FormQuestionTypeEnum; acceptOther?: boolean }) {
    this.text = params.text || this.text;
    this.type = params.type || this.type;
    this.acceptOther = updateField(this.acceptOther, params.acceptOther);
  }

  clone() {
    return Object.assign({}, this);
  }

  diff() {
    return compareEntities(this._originalEntity, this, { keysToCompare: Object.keys(this._originalEntity) });
  }

  get needsOptions(): boolean {
    return this.type === 'RADIO' || this.type === 'CHECKBOX' || this.type === 'SELECT';
  }
}
