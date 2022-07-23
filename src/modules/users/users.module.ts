import { forwardRef, Module } from '@nestjs/common';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { FirebaseProvider } from '../../shared/providers/FirebaseProvider/FirebaseProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { SendGridProvider } from '../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokensRepository } from '../auth/repositories/implementations/RefreshTokensRepository';
import { CompanyModule } from '../company/company.module';
import { InvitesController } from './controller/invites/invites.controller';
import { ProfessionalsController } from './controller/professionals/professionals.controller';
import { UsersController } from './controller/users/users.controller';
import { InviteUsersRepository } from './repositories/implementations/InviteUsersRepository';
import { ProfessionalRepository } from './repositories/implementations/ProfessionalRepository';
import { UsersCompanyRepository } from './repositories/implementations/UsersCompanyRepository';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { DeleteExpiredInvitesService } from './services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from './services/invites/delete-invites/delete-invites.service';
import { FindAllByCompanyIdService } from './services/invites/find-by-companyId/find-by-companyId.service';
import { FindAllByEmailService } from './services/invites/find-by-email/find-by-email.service';
import { FindByTokenService } from './services/invites/find-by-token/find-by-token.service';
import { InviteUsersService } from './services/invites/invite-users/invite-users.service';
import { FindAllProfessionalsByCompanyService } from './services/professionals/find-all/find-all.service';
import { CreateUserService } from './services/users/create-user/create-user.service';
import { FindAllByCompanyService } from './services/users/find-all/find-all.service';
import { FindByEmailService } from './services/users/find-by-email/find-by-email.service';
import { FindByIdService } from './services/users/find-by-id/find-by-id.service';
import { FindMeService } from './services/users/find-me/find-me.service';
import { ResetPasswordService } from './services/users/reset-password/reset-password.service';
import { UpdatePermissionsRolesService } from './services/users/update-permissions-roles/update-permissions-roles.service';
import { UpdateUserService } from './services/users/update-user/update-user.service';

@Module({
  controllers: [UsersController, InvitesController, ProfessionalsController],
  imports: [forwardRef(() => AuthModule), CompanyModule],
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
    ProfessionalRepository,
    FindAllProfessionalsByCompanyService,
    FirebaseProvider,
  ],
  exports: [UsersRepository, ProfessionalRepository],
})
export class UsersModule {}
