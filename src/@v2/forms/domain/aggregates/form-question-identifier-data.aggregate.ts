import { FormQuestionDetailsEntity } from '../entities/form-question-details.entity';
import { FormQuestionIdentifierEntity } from '../entities/form-question-identifier.entity';

export type IFormQuestionIdentifierDataAggregate = {
  data: FormQuestionDetailsEntity;
  identifier: FormQuestionIdentifierEntity;
};

export class FormQuestionIdentifierDataAggregate {
  data: FormQuestionDetailsEntity;
  identifier: FormQuestionIdentifierEntity;

  constructor(params: IFormQuestionIdentifierDataAggregate) {
    this.data = params.data;
    this.identifier = params.identifier;
  }
}
