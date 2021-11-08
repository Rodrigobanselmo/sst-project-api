import { Module } from '@nestjs/common';

import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { UsersController } from './controller/users.controller';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { CreateUserService } from './services/create-user/create-user.service';
import { UpdateUserService } from './services/update-user/update-user.service';
import { ResetPasswordService } from './services/reset-password/reset-password.service';
import { FindByIdService } from './services/find-by-id/find-by-id.service';
import { FindByEmailService } from './services/find-by-email/find-by-email.service';
import { RefreshTokensRepository } from '../auth/repositories/implementations/RefreshTokensRepository';

@Module({
  controllers: [UsersController],
  providers: [
    HashProvider,
    UsersRepository,
    CreateUserService,
    UpdateUserService,
    ResetPasswordService,
    FindByIdService,
    FindByEmailService,
    RefreshTokensRepository,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
