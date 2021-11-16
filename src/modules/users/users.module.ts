import { InviteUsersRepository } from './repositories/implementations/InviteUsersRepository';
import { Module } from '@nestjs/common';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { RefreshTokensRepository } from '../auth/repositories/implementations/RefreshTokensRepository';
import { UsersController } from './controller/users/users.controller';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { CreateUserService } from './services/create-user/create-user.service';
import { FindByEmailService } from './services/find-by-email/find-by-email.service';
import { FindByIdService } from './services/find-by-id/find-by-id.service';
import { InviteUsersService } from './services/invite-users/invite-users.service';
import { ResetPasswordService } from './services/reset-password/reset-password.service';
import { UpdateUserService } from './services/update-user/update-user.service';
import { InvitesController } from './controller/invites/invites.controller';
import { DeleteInvitesService } from './services/delete-invites/delete-invites.service';
import { DeleteExpiredInvitesService } from './services/delete-expired-invites/delete-expired-invites.service';
import { EtherealMailProvider } from '../../shared/providers/MailProvider/implementations/Ethereal/EtherealMailProvider';
import { FindMeService } from './services/find-me/find-me.service';

@Module({
  controllers: [UsersController, InvitesController],
  providers: [
    HashProvider,
    DayJSProvider,
    EtherealMailProvider,
    UsersRepository,
    CreateUserService,
    UpdateUserService,
    ResetPasswordService,
    FindByIdService,
    FindByEmailService,
    InviteUsersService,
    RefreshTokensRepository,
    InviteUsersRepository,
    DeleteInvitesService,
    DeleteExpiredInvitesService,
    FindMeService,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
