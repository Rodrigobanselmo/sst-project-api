"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const DayJSProvider_1 = require("../../shared/providers/DateProvider/implementations/DayJSProvider");
const FirebaseProvider_1 = require("../../shared/providers/FirebaseProvider/FirebaseProvider");
const HashProvider_1 = require("../../shared/providers/HashProvider/implementations/HashProvider");
const SendGridProvider_1 = require("../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
const auth_module_1 = require("../auth/auth.module");
const RefreshTokensRepository_1 = require("../auth/repositories/implementations/RefreshTokensRepository");
const company_module_1 = require("../company/company.module");
const invites_controller_1 = require("./controller/invites/invites.controller");
const professionals_responsible_controller_1 = require("./controller/professionals-responsible/professionals-responsible.controller");
const professionals_controller_1 = require("./controller/professionals/professionals.controller");
const users_controller_1 = require("./controller/users/users.controller");
const InviteUsersRepository_1 = require("./repositories/implementations/InviteUsersRepository");
const ProfessionalRepository_1 = require("./repositories/implementations/ProfessionalRepository");
const ProfessionalResponsibleRepository_1 = require("./repositories/implementations/ProfessionalResponsibleRepository");
const UsersCompanyRepository_1 = require("./repositories/implementations/UsersCompanyRepository");
const UsersRepository_1 = require("./repositories/implementations/UsersRepository");
const delete_expired_invites_service_1 = require("./services/invites/delete-expired-invites/delete-expired-invites.service");
const delete_invites_service_1 = require("./services/invites/delete-invites/delete-invites.service");
const find_available_service_1 = require("./services/invites/find-available/find-available.service");
const find_by_companyId_service_1 = require("./services/invites/find-by-companyId/find-by-companyId.service");
const find_by_email_service_1 = require("./services/invites/find-by-email/find-by-email.service");
const find_by_token_service_1 = require("./services/invites/find-by-token/find-by-token.service");
const invite_users_service_1 = require("./services/invites/invite-users/invite-users.service");
const create_professional_responsiblea_service_1 = require("./services/professionals-responsibles/create-professionals-responsibles/create-professional-responsiblea.service");
const delete_professionals_responsibles_service_1 = require("./services/professionals-responsibles/delete-professionals-responsibles/delete-professionals-responsibles.service");
const find_professionals_responsibles_service_1 = require("./services/professionals-responsibles/find-professionals-responsibles/find-professionals-responsibles.service");
const update_professionals_responsibles_service_1 = require("./services/professionals-responsibles/update-professionals-responsibles/update-professionals-responsibles.service");
const create_professional_service_1 = require("./services/professionals/create-professional/create-professional.service");
const find_all_service_1 = require("./services/professionals/find-all/find-all.service");
const find_first_service_1 = require("./services/professionals/find-first/find-first.service");
const update_professional_service_1 = require("./services/professionals/update-professional/update-professional.service");
const create_user_service_1 = require("./services/users/create-user/create-user.service");
const find_all_service_2 = require("./services/users/find-all/find-all.service");
const find_by_email_service_2 = require("./services/users/find-by-email/find-by-email.service");
const find_by_id_service_1 = require("./services/users/find-by-id/find-by-id.service");
const find_me_service_1 = require("./services/users/find-me/find-me.service");
const reset_password_service_1 = require("./services/users/reset-password/reset-password.service");
const update_permissions_roles_service_1 = require("./services/users/update-permissions-roles/update-permissions-roles.service");
const update_user_service_1 = require("./services/users/update-user/update-user.service");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController, invites_controller_1.InvitesController, professionals_controller_1.ProfessionalsController, professionals_responsible_controller_1.ProfessionalResponsibleController],
        imports: [(0, common_1.forwardRef)(() => auth_module_1.AuthModule), company_module_1.CompanyModule],
        providers: [
            HashProvider_1.HashProvider,
            DayJSProvider_1.DayJSProvider,
            SendGridProvider_1.SendGridProvider,
            UsersRepository_1.UsersRepository,
            create_user_service_1.CreateUserService,
            update_user_service_1.UpdateUserService,
            reset_password_service_1.ResetPasswordService,
            find_by_id_service_1.FindByIdService,
            find_by_email_service_2.FindByEmailService,
            find_by_companyId_service_1.FindAllByCompanyIdService,
            invite_users_service_1.InviteUsersService,
            delete_invites_service_1.DeleteInvitesService,
            find_all_service_2.FindAllByCompanyService,
            delete_expired_invites_service_1.DeleteExpiredInvitesService,
            find_me_service_1.FindMeService,
            RefreshTokensRepository_1.RefreshTokensRepository,
            InviteUsersRepository_1.InviteUsersRepository,
            UsersCompanyRepository_1.UsersCompanyRepository,
            find_by_token_service_1.FindByTokenService,
            update_permissions_roles_service_1.UpdatePermissionsRolesService,
            find_by_email_service_1.FindAllByEmailService,
            ProfessionalRepository_1.ProfessionalRepository,
            find_all_service_1.FindAllProfessionalsByCompanyService,
            FirebaseProvider_1.FirebaseProvider,
            update_professional_service_1.UpdateProfessionalService,
            create_professional_service_1.CreateProfessionalService,
            find_available_service_1.FindAvailableService,
            find_first_service_1.FindFirstProfessionalService,
            create_professional_responsiblea_service_1.CreateProfessionalResponsibleService,
            update_professionals_responsibles_service_1.UpdateProfessionalResponsibleService,
            find_professionals_responsibles_service_1.FindProfessionalResponsibleService,
            delete_professionals_responsibles_service_1.DeleteProfessionalResponsibleService,
            ProfessionalResponsibleRepository_1.ProfessionalResponsibleRepository,
        ],
        exports: [UsersRepository_1.UsersRepository, ProfessionalRepository_1.ProfessionalRepository],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map