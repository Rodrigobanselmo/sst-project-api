import { Module } from '@nestjs/common';

import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { CreateUserController } from './useCases/create-user/create-user.controller';
import { CreateUserService } from './useCases/create-user/create-user.service';

@Module({
  controllers: [CreateUserController],
  providers: [HashProvider, UsersRepository, CreateUserService],
})
export class UsersModule {}
