import { UserModel } from '../../../domain/models/user.model';

export namespace IUserDao {
  export type FindParams = { id: number };
  export type FindReturn = Promise<UserModel | null>;
}
