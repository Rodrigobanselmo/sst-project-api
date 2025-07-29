import { FormQuestionIdentifierGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-group.aggregate';

export namespace IFormQuestionIdentifierGroupAggregateRepository {
  export type CreateTxParams = FormQuestionIdentifierGroupAggregate;

  export type UpsertTxParams = FormQuestionIdentifierGroupAggregate;
}
