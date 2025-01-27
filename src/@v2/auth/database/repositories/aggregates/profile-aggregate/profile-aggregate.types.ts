import { ProfileAggregate } from '@/@v2/auth/domain/aggregate/profile.aggregate';

export namespace IProfileAggregateRepository {
  export type SelectOptionsParams = { companyId: string };

  export type CreateParams = ProfileAggregate;
  export type CreateReturn = Promise<ProfileAggregate | null>;

  export type UpdateParams = ProfileAggregate;
  export type UpdateReturn = Promise<ProfileAggregate | null>;

  export type FindParams = { userId: number; companyId: string };
  export type FindReturn = Promise<ProfileAggregate | null>;
}
