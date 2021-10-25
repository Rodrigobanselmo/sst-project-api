import { Injectable } from '@nestjs/common';

import { HashProvider } from '../../../../shared/providers/HashProvider/implementations/HashProvider';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(createUserDto: CreateUserDto) {
    const passHash = await this.hashProvider.createHash(createUserDto.password);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: passHash,
    });

    return user;
  }
}
