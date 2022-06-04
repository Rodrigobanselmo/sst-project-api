import { InviteUsersRepository } from './repositories/implementations/InviteUsersRepository';
import { forwardRef, Module } from '@nestjs/common';

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
import { SendGridProvider } from '../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { FindMeService } from './services/users/find-me/find-me.service';
import { UsersCompanyRepository } from './repositories/implementations/UsersCompanyRepository';
import { FindByTokenService } from './services/invites/find-by-token/find-by-token.service';
import { UpdatePermissionsRolesService } from './services/users/update-permissions-roles/update-permissions-roles.service';
import { AuthModule } from '../auth/auth.module';
import { FindAllByCompanyService } from './services/users/find-all/find-all.service';
import { FindAllByCompanyIdService } from './services/invites/find-by-companyId/find-by-companyId.service';
import { FindAllByEmailService } from './services/invites/find-by-email/find-by-email.service';

@Module({
  controllers: [UsersController, InvitesController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    HashProvider,
    DayJSProvider,
    SendGridProvider,
    UsersRepository,
    CreateUserService,
    UpdateUserService,
    ResetPasswordService,
    FindByIdService,
    FindByEmailService,
    FindAllByCompanyIdService,
    InviteUsersService,
    DeleteInvitesService,
    FindAllByCompanyService,
    DeleteExpiredInvitesService,
    FindMeService,
    RefreshTokensRepository,
    InviteUsersRepository,
    UsersCompanyRepository,
    FindByTokenService,
    UpdatePermissionsRolesService,
    FindAllByEmailService,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
