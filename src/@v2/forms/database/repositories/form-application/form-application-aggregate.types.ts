import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';

export namespace IFormApplicationAggregateRepository {
  export type CreateParams = FormApplicationAggregate;
  export type CreateReturn = Promise<FormApplicationAggregate | null>;

  export type UpdateParams = FormApplicationAggregate;
  export type UpdateReturn = Promise<FormApplicationAggregate | null>;

  export type FindParams = { id: string; companyId: string };
  export type FindReturn = Promise<FormApplicationAggregate | null>;
}
