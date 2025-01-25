import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { UserAggregateRepository } from './database/repositories/aggregates/user-aggregate/user-aggregate.repository';
import { ProfileAggregateRepository } from './database/repositories/aggregates/profile-aggregate/profile-aggregate.repository';
import { AccessGroupRepository } from './database/repositories/entities/access-group/access-group.repository';
import { UserRepository } from './database/repositories/entities/user/user.repository';
import { AuthUserMailAdapter } from './adapters/mail/auth-user-mail.adapter.ts';
import { UserDAO } from './database/dao/user/user.dao';
import { AddUserController } from './application/user/add-user/controllers/add-user.controller';
import { AddUserUseCase } from './application/user/add-user/use-cases/add-user.usecase';
import { SignInUseCase } from './application/session/signin/use-cases/sign-in.usecase';

@Module({
  imports: [SharedModule],
  controllers: [AddUserController],
  providers: [
    // Database
    UserAggregateRepository,
    AccessGroupRepository,
    ProfileAggregateRepository,
    UserRepository,
    UserDAO,

    //Adapters
    AuthUserMailAdapter,

    // Use Cases
    AddUserUseCase,
    SignInUseCase,
  ],
  exports: [],
})
export class AuthModule {}
