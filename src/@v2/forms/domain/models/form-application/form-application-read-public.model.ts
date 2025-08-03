import { FormTypeEnum } from '../../enums/form-type.enum';
import { FormQuestionGroupReadModel } from '../shared/form-question-group-read.model';

export type IFormApplicationReadPublicModel = {
  id: string;
  name: string;
  description: string | undefined;
  form: {
    name: string;
    type: FormTypeEnum;
    questionGroups: FormQuestionGroupReadModel[];
  };
  questionIdentifierGroup: FormQuestionGroupReadModel;
};

export class FormApplicationReadPublicModel {
  id: string;
  name: string;
  description: string | undefined;
  form: {
    name: string;
    type: FormTypeEnum;
    questionGroups: FormQuestionGroupReadModel[];
  };
  questionIdentifierGroup: FormQuestionGroupReadModel;

  constructor(params: IFormApplicationReadPublicModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.form = params.form;
    this.questionIdentifierGroup = params.questionIdentifierGroup;
  }
}
