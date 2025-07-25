import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export type IFormQuestionDetailsReadModel = {
  id: string;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  companyId?: string;
};

export class FormQuestionDetailsReadModel {
  id: string;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  companyId?: string;

  constructor(params: IFormQuestionDetailsReadModel) {
    this.id = params.id;
    this.text = params.text;
    this.type = params.type;
    this.acceptOther = params.acceptOther;
    this.system = params.system;
    this.companyId = params.companyId;
  }
}
