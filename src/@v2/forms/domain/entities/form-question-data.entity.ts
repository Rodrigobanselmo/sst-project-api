import { FormQuestionTypeEnum } from '../enums/form-question-type.enum';

export type FormQuestionDataEntityConstructor = {
  id?: number;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  companyId: string;

  constructor(params: FormQuestionDataEntityConstructor) {
    this.id = params.id ?? 0;
    this.text = params.text;
    this.type = params.type;
    this.acceptOther = params.acceptOther ?? false;
    this.system = params.system ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.companyId = params.companyId;
  }
}
