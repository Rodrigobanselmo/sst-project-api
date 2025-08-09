import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';

export namespace IFormApplicationAggregateRepository {
  export type CreateParams = FormApplicationAggregate;
  export type CreateReturn = Promise<boolean>;

  export type UpdateParams = FormApplicationAggregate;
  export type UpdateReturn = Promise<boolean>;

  export type FindParams = { id: string; companyId: string };
  export type FindReturn = Promise<FormApplicationAggregate | null>;
}
