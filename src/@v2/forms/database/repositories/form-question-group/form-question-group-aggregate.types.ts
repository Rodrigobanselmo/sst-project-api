import { FormQuestionGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-group.aggregate';

export namespace IFormQuestionGroupAggregateRepository {
  export type CreateTxParams = FormQuestionGroupAggregate;

  export type UpsertTxParams = FormQuestionGroupAggregate;
}
