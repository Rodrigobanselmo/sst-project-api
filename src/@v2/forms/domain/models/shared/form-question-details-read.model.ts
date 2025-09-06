import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormIdentifierTypeEnum } from '../../enums/form-identifier-type.enum';

export type FormQuestionRiskReadModel = {
  id: string;
  name: string;
};

export type IFormQuestionDetailsReadModel = {
  id: string;
  text: string;
  type: FormQuestionTypeEnum;
  identifierType?: FormIdentifierTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  companyId?: string;
  risks?: FormQuestionRiskReadModel[];
};

export class FormQuestionDetailsReadModel {
  id: string;
  text: string;
  type: FormQuestionTypeEnum;
  identifierType?: FormIdentifierTypeEnum;
  acceptOther?: boolean;
  system?: boolean;
  companyId?: string;
  risks?: FormQuestionRiskReadModel[];

  constructor(params: IFormQuestionDetailsReadModel) {
    this.id = params.id;
    this.text = params.text;
    this.type = params.type;
    this.acceptOther = params.acceptOther;
    this.identifierType = params.identifierType;
    this.system = params.system;
    this.companyId = params.companyId;
    this.risks = params.risks;
  }
}
