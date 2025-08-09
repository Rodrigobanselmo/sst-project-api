import { FormQuestionDetailsEntity } from '../entities/form-question-details.entity';
import { FormQuestionIdentifierEntity } from '../entities/form-question-identifier.entity';
import { FormQuestionOptionEntity } from '../entities/form-question-option.entity';
import { FormQuestionEntity } from '../entities/form-question.entity';

export type IFormQuestionAggregate = {
  question: FormQuestionEntity;
  details: FormQuestionDetailsEntity;
  options: FormQuestionOptionEntity[];
  identifier: FormQuestionIdentifierEntity | null;
};

export class FormQuestionAggregate {
  question: FormQuestionEntity;
  details: FormQuestionDetailsEntity;
  options: FormQuestionOptionEntity[];
  identifier: FormQuestionIdentifierEntity | null;

  constructor(params: IFormQuestionAggregate) {
    this.question = params.question;
    this.details = params.details;
    this.options = params.options;
    this.identifier = params.identifier || null;
  }
}
