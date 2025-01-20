import { User } from '@prisma/client';
import { UserEntity } from '../../../domain/entities/user.entity';

type IUserEntityMapper = User;

export class UserMapper {
  static toEntity(data: IUserEntityMapper): UserEntity {
    return new UserEntity({
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      cpf: data.cpf,
    });
  }
}
