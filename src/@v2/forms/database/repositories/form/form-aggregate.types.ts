import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';

export namespace IFormAggregateRepository {
  export type CreateParams = FormAggregate;
  export type CreateReturn = Promise<FormAggregate | null>;

  export type FindParams = { id: string; companyId: string };
  export type FindReturn = Promise<FormAggregate | null>;

  export type UpdateParams = FormAggregate;
  export type UpdateReturn = Promise<FormAggregate | null>;
}
