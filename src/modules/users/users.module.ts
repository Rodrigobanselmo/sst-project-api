import { Module } from '@nestjs/common';

import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { UsersController } from './controller/users.controller';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { CreateUserService } from './services/create-user/create-user.service';

@Module({
  controllers: [UsersController],
  providers: [HashProvider, UsersRepository, CreateUserService],
  exports: [UsersRepository],
})
export class UsersModule {}
