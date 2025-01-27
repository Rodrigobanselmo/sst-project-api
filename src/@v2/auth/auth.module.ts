import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { AuthUserMailAdapter } from './adapters/mail/auth-user-mail.adapter.ts';
import { SignInController } from './application/session/signin/controllers/sign-in.controller';
import { SignInUseCase } from './application/session/signin/use-cases/sign-in.usecase';
import { AddUserController } from './application/user/add-user/controllers/add-user.controller';
import { AddUserUseCase } from './application/user/add-user/use-cases/add-user.usecase';
import { CompanyDAO } from './database/dao/company/company.dao';
import { UserDAO } from './database/dao/user/user.dao';
import { ProfileAggregateRepository } from './database/repositories/aggregates/profile-aggregate/profile-aggregate.repository';
import { UserAggregateRepository } from './database/repositories/aggregates/user-aggregate/user-aggregate.repository';
import { AccessGroupRepository } from './database/repositories/entities/access-group/access-group.repository';
import { UserRepository } from './database/repositories/entities/user/user.repository';
import { EmployeeRepository } from './database/repositories/entities/employee/employee.repository.js';

@Module({
  imports: [SharedModule],
  controllers: [AddUserController, SignInController],
  providers: [
    // Database
    UserAggregateRepository,
    AccessGroupRepository,
    ProfileAggregateRepository,
    UserRepository,
    UserDAO,
    CompanyDAO,
    EmployeeRepository,

    //Adapters
    AuthUserMailAdapter,

    // Use Cases
    AddUserUseCase,
    SignInUseCase,
  ],
  exports: [],
})
export class AuthModule {}
