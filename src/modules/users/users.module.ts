import { InviteUsersRepository } from './repositories/implementations/InviteUsersRepository';
import { Module } from '@nestjs/common';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { RefreshTokensRepository } from '../auth/repositories/implementations/RefreshTokensRepository';
import { UsersController } from './controller/users/users.controller';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { CreateUserService } from './services/users/create-user/create-user.service';
import { FindByEmailService } from './services/users/find-by-email/find-by-email.service';
import { FindByIdService } from './services/users/find-by-id/find-by-id.service';
import { InviteUsersService } from './services/invites/invite-users/invite-users.service';
import { ResetPasswordService } from './services/users/reset-password/reset-password.service';
import { UpdateUserService } from './services/users/update-user/update-user.service';
import { InvitesController } from './controller/invites/invites.controller';
import { DeleteInvitesService } from './services/invites/delete-invites/delete-invites.service';
import { DeleteExpiredInvitesService } from './services/invites/delete-expired-invites/delete-expired-invites.service';
import { AwsSesProvider } from '../../shared/providers/MailProvider/implementations/AwsSes/AwsSesProvider';
import { FindMeService } from './services/users/find-me/find-me.service';
import { UsersCompanyRepository } from './repositories/implementations/UsersCompanyRepository';
import { FindByTokenService } from './services/invites/find-by-token/find-by-token.service';
import { UpdatePermissionsRolesService } from './services/users/update-permissions-roles/update-permissions-roles.service';

@Module({
  controllers: [UsersController, InvitesController],
  providers: [
    HashProvider,
    DayJSProvider,
    AwsSesProvider,
    UsersRepository,
    CreateUserService,
    UpdateUserService,
    ResetPasswordService,
    FindByIdService,
    FindByEmailService,
    InviteUsersService,
    DeleteInvitesService,
    DeleteExpiredInvitesService,
    FindMeService,
    RefreshTokensRepository,
    InviteUsersRepository,
    UsersCompanyRepository,
    FindByTokenService,
    UpdatePermissionsRolesService,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
