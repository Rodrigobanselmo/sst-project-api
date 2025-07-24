import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { FormQuestionTypeEnum } from '../enums/form-question-type.enum';
import { compareObjects } from '@/@v2/shared/domain/helpers/object-diff.helper';

export type FormQuestionDetailsEntityConstructor = {
  id?: number;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  companyId: string;
};

export class FormQuestionDetailsEntity {
  id: number;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther: boolean;
  system: boolean;
  createdAt: Date;
  deletedAt?: Date;
  companyId: string;

  private _originalEntity: FormQuestionDetailsEntity;

  constructor(params: FormQuestionDetailsEntityConstructor) {
    this.id = params.id ?? 0;
    this.text = params.text;
    this.type = params.type;
    this.acceptOther = params.acceptOther ?? false;
    this.system = params.system ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.deletedAt = params.deletedAt;
    this.companyId = params.companyId;

    this._originalEntity = this.clone();
  }

  get originalEntity() {
    return this._originalEntity;
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
    return compareObjects(this._originalEntity, this);
  }

  get needsOptions(): boolean {
    return this.type === 'RADIO' || this.type === 'CHECKBOX' || this.type === 'SELECT';
  }
}
