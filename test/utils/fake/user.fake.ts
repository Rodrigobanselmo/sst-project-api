import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';
import * as faker from 'faker';

export class FakerUser implements CreateUserDto {
  email = faker.lorem.word() + faker.internet.email();
  password: '12345678';
  roles: [];
  permissions: [];

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
