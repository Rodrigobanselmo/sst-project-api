import { FormEntity } from '../entities/form.entity';
import { FormQuestionGroupEntity } from '../entities/form-question-group.entity';
import { FormQuestionAggregate } from './form-question.aggregate';

export type IFormQuestionGroupAggregate = {
  questionGroup: FormQuestionGroupEntity;
  questions: FormQuestionAggregate[];
  form: FormEntity;
};

export class FormQuestionGroupAggregate {
  questionGroup: FormQuestionGroupEntity;
  questions: FormQuestionAggregate[];
  form: FormEntity;

  constructor(params: IFormQuestionGroupAggregate) {
    this.questionGroup = params.questionGroup;
    this.questions = params.questions;
    this.form = params.form;
  }
}
