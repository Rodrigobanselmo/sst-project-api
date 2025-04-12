import { FormQuestionEntity } from '../entities/form-question.entity';
import { FormQuestionIdentifierDataAggregate } from './form-question-identifier-data.aggregate';

export type IFormQuestionIdentifierAggregate = {
  question: FormQuestionEntity;
  identifierData: FormQuestionIdentifierDataAggregate;
};

export class FormQuestionIdentifierAggregate {
  question: FormQuestionEntity;
  identifierData: FormQuestionIdentifierDataAggregate;

  constructor(params: IFormQuestionIdentifierAggregate) {
    this.question = params.question;
    this.identifierData = params.identifierData;
  }
}
