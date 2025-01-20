import { UserAggregate } from '../../../domain/aggregate/user.aggregate';

export namespace IUserAggregateRepository {
  export type CreateParams = UserAggregate;
  export type CreateReturn = Promise<UserAggregate | null>;

  export type UpdateParams = UserAggregate;
  export type UpdateReturn = Promise<UserAggregate | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<UserAggregate | null>;

  export type FindByEmailParams = { email: string };
  export type FindByEmailReturn = Promise<UserAggregate | null>;
}
