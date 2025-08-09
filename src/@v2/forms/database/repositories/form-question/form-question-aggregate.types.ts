import { FormQuestionAggregate } from '@/@v2/forms/domain/aggregates/form-question.aggregate';

export namespace IFormQuestionAggregateRepository {
  export type CreateTxParams = FormQuestionAggregate;

  export type UpsertTxParams = FormQuestionAggregate;
}
