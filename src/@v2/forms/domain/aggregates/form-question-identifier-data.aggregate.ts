import { FormQuestionDataEntity } from '../entities/form-question-data.entity';
import { FormQuestionIdentifierEntity } from '../entities/form-question-identifier.entity';

export type IFormQuestionIdentifierDataAggregate = {
  data: FormQuestionDataEntity;
  identifier: FormQuestionIdentifierEntity;
};

export class FormQuestionIdentifierDataAggregate {
  data: FormQuestionDataEntity;
  identifier: FormQuestionIdentifierEntity;

  constructor(params: IFormQuestionIdentifierDataAggregate) {
    this.data = params.data;
    this.identifier = params.identifier;
  }
}
