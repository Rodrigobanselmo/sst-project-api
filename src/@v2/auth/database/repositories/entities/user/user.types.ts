import { UserEntity } from '@/@v2/auth/domain/entities/user.entity';

export namespace IUserRepository {
  export type CreateParams = UserEntity;
  export type CreateReturn = Promise<UserEntity | null>;

  export type UpdateParams = UserEntity;
  export type UpdateReturn = Promise<UserEntity | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<UserEntity | null>;

  export type FindByEmailParams = { email: string };
  export type FindByEmailReturn = Promise<UserEntity | null>;

  export type FindByTokenParams = { token: string };
  export type FindByTokenReturn = Promise<UserEntity | null>;
}
