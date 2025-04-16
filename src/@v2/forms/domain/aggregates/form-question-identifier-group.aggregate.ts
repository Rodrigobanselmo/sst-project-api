import { removeDuplicate } from '@/@v2/shared/utils/helpers/remove-duplicate';
import { FormQuestionIdentifierGroupEntity } from '../entities/form-question-identifier-group.entity';
import { FormQuestionIdentifierAggregate } from './form-question-identifier.aggregate';

export type IFormQuestionIdentifierGroupAggregate = {
  group: FormQuestionIdentifierGroupEntity;
  questionIdentifiers: FormQuestionIdentifierAggregate[];
};

export class FormQuestionIdentifierGroupAggregate {
  group: FormQuestionIdentifierGroupEntity;
  questionIdentifiers: FormQuestionIdentifierAggregate[];

  constructor(params: IFormQuestionIdentifierGroupAggregate) {
    this.group = params.group;
    this.questionIdentifiers = params.questionIdentifiers;
  }
}
