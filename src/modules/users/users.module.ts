import { forwardRef, Module } from '@nestjs/common';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { FirebaseProvider } from '../../shared/providers/FirebaseProvider/FirebaseProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { NodeMailProvider } from '../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokensRepository } from '../auth/repositories/implementations/RefreshTokensRepository';
import { CompanyModule } from '../company/company.module';
import { CouncilController } from './controller/council/council.controller';
import { InvitesController } from './controller/invites/invites.controller';
import { ProfessionalResponsibleController } from './controller/professionals-responsible/professionals-responsible.controller';
import { ProfessionalsController } from './controller/professionals/professionals.controller';
import { UsersController } from './controller/users/users.controller';
import { InviteUsersRepository } from './repositories/implementations/InviteUsersRepository';
import { ProfessionalRepository } from './repositories/implementations/ProfessionalRepository';
import { ProfessionalResponsibleRepository } from './repositories/implementations/ProfessionalResponsibleRepository';
import { UsersCompanyRepository } from './repositories/implementations/UsersCompanyRepository';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { DeleteExpiredInvitesService } from './services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from './services/invites/delete-invites/delete-invites.service';
import { FindAvailableService } from './services/invites/find-available/find-available.service';
import { FindAllByCompanyIdService } from './services/invites/find-by-companyId/find-by-companyId.service';
import { FindAllByEmailService } from './services/invites/find-by-email/find-by-email.service';
import { FindByTokenService } from './services/invites/find-by-token/find-by-token.service';
import { InviteUsersService } from './services/invites/invite-users/invite-users.service';
import { CreateProfessionalResponsibleService } from './services/professionals-responsibles/create-professionals-responsibles/create-professional-responsiblea.service';
import { DeleteProfessionalResponsibleService } from './services/professionals-responsibles/delete-professionals-responsibles/delete-professionals-responsibles.service';
import { FindProfessionalResponsibleService } from './services/professionals-responsibles/find-professionals-responsibles/find-professionals-responsibles.service';
import { UpdateProfessionalResponsibleService } from './services/professionals-responsibles/update-professionals-responsibles/update-professionals-responsibles.service';
import { CreateCouncilService } from './services/professionals/create-council/create-council.service';
import { CreateProfessionalService } from './services/professionals/create-professional/create-professional.service';
import { DeleteCouncilService } from './services/professionals/delete-council/delete-council.service';
import { FindAllProfessionalsByCompanyService } from './services/professionals/find-all/find-all.service';
import { FindFirstProfessionalService } from './services/professionals/find-first/find-first.service';
import { UpdateCouncilService } from './services/professionals/update-council/update-council.service';
import { UpdateProfessionalService } from './services/professionals/update-professional/update-professional.service';
import { CreateUserService } from './services/users/create-user/create-user.service';
import { FindAllByCompanyService } from './services/users/find-all/find-all.service';
import { FindByEmailService } from './services/users/find-by-email/find-by-email.service';
import { FindByIdService } from './services/users/find-by-id/find-by-id.service';
import { FindMeService } from './services/users/find-me/find-me.service';
import { ResetPasswordService } from './services/users/reset-password/reset-password.service';
import { UpdatePermissionsRolesService } from './services/users/update-permissions-roles/update-permissions-roles.service';
import { UpdateUserService } from './services/users/update-user/update-user.service';

@Module({
  controllers: [UsersController, InvitesController, ProfessionalsController, ProfessionalResponsibleController, CouncilController],
  imports: [forwardRef(() => AuthModule), CompanyModule],
  providers: [
    HashProvider,
    DayJSProvider,
    NodeMailProvider,
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
    UpdateProfessionalService,
    CreateProfessionalService,
    FindAvailableService,
    FindFirstProfessionalService,
    CreateProfessionalResponsibleService,
    UpdateProfessionalResponsibleService,
    FindProfessionalResponsibleService,
    DeleteProfessionalResponsibleService,
    ProfessionalResponsibleRepository,
    UpdateCouncilService,
    DeleteCouncilService,
    CreateCouncilService,
  ],
  exports: [UsersRepository, ProfessionalRepository],
})
export class UsersModule { }
