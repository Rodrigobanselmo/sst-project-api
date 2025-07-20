import { FormQuestionTypeEnum } from '../enums/form-question-type.enum';

export type FormQuestionDataEntityConstructor = {
  id?: number;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  companyId: string;
};

export class FormQuestionDataEntity {
  id: number;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther: boolean;
  system: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  companyId: string;

  constructor(params: FormQuestionDataEntityConstructor) {
    this.id = params.id ?? 0;
    this.text = params.text;
    this.type = params.type;
    this.acceptOther = params.acceptOther ?? false;
    this.system = params.system ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt;
    this.companyId = params.companyId;
  }

  get needsOptions(): boolean {
    return this.type === 'RADIO' || this.type === 'CHECKBOX' || this.type === 'SELECT';
  }

  equals(other: { text: string; type: FormQuestionTypeEnum; acceptOther?: boolean }): boolean {
    return this.text === other.text && this.type === other.type && this.acceptOther === other.acceptOther;
  }
}
