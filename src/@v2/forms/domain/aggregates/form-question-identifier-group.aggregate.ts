import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormQuestionGroupEntity } from '../entities/form-question-group.entity';
import { FormQuestionAggregate } from './form-question.aggregate';

export type IFormQuestionIdentifierGroupAggregate = {
  questionGroup: FormQuestionGroupEntity;
  questions: FormQuestionAggregate[];
  formApplication: FormApplicationEntity;
};

export class FormQuestionIdentifierGroupAggregate {
  questionGroup: FormQuestionGroupEntity;
  questions: FormQuestionAggregate[];
  formApplication: FormApplicationEntity;

  constructor(params: IFormQuestionIdentifierGroupAggregate) {
    this.questionGroup = params.questionGroup;
    this.questions = params.questions;
    this.formApplication = params.formApplication;
  }
}
