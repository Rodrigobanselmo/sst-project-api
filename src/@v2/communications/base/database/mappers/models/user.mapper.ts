import { UserModel } from '../../../domain/models/user.model';

export type IUserModelMapper = {
  id: number;
  name: string;
  email: string;
  token: string | null;
  password?: string | null;
};

export class UserMapper {
  static toModel(data: IUserModelMapper): UserModel {
    return new UserModel({
      id: data.id,
      name: data.name,
      email: data.email,
      token: data.token || undefined,
      isActive: Boolean(data.password),
    });
  }
}
