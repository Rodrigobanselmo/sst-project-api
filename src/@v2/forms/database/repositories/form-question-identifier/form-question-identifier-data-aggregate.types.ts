import { FormQuestionIdentifierDataAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-data.aggregate';

// RELOAD
export namespace IFormQuestionIdentifierDataAggregateRepository {
  export type CreateParams = FormQuestionIdentifierDataAggregate;
  export type CreateReturn = Promise<FormQuestionIdentifierDataAggregate | null>;

  export type UpdateParams = FormQuestionIdentifierDataAggregate;
  export type UpdateReturn = Promise<FormQuestionIdentifierDataAggregate | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<FormQuestionIdentifierDataAggregate | null>;

  export type FindManyParams = { ids: number[]; companyId: string };
  export type FindManyReturn = Promise<FormQuestionIdentifierDataAggregate[]>;
}
