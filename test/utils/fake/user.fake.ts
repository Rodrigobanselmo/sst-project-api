import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';
import * as faker from 'faker';

export class FakerUser implements CreateUserDto {
  constructor(partial?: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  email = faker.lorem.word() + faker.internet.email();
  password = '12345678';
  token = '';
}
