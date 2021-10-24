import { Module } from '@nestjs/common';
import { CreateUserController } from './useCases/create-user/create-user.controller';
import { CreateUserService } from './useCases/create-user/create-user.service';

@Module({
  controllers: [CreateUserController],
  providers: [CreateUserService],
})
export class UsersModule {}
