"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const InviteUsersRepository_1 = require("./repositories/implementations/InviteUsersRepository");
const common_1 = require("@nestjs/common");
const DayJSProvider_1 = require("../../shared/providers/DateProvider/implementations/DayJSProvider");
const HashProvider_1 = require("../../shared/providers/HashProvider/implementations/HashProvider");
const RefreshTokensRepository_1 = require("../auth/repositories/implementations/RefreshTokensRepository");
const users_controller_1 = require("./controller/users/users.controller");
const UsersRepository_1 = require("./repositories/implementations/UsersRepository");
const create_user_service_1 = require("./services/users/create-user/create-user.service");
const find_by_email_service_1 = require("./services/users/find-by-email/find-by-email.service");
const find_by_id_service_1 = require("./services/users/find-by-id/find-by-id.service");
const invite_users_service_1 = require("./services/invites/invite-users/invite-users.service");
const reset_password_service_1 = require("./services/users/reset-password/reset-password.service");
const update_user_service_1 = require("./services/users/update-user/update-user.service");
const invites_controller_1 = require("./controller/invites/invites.controller");
const delete_invites_service_1 = require("./services/invites/delete-invites/delete-invites.service");
const delete_expired_invites_service_1 = require("./services/invites/delete-expired-invites/delete-expired-invites.service");
const SendGridProvider_1 = require("../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
const find_me_service_1 = require("./services/users/find-me/find-me.service");
const UsersCompanyRepository_1 = require("./repositories/implementations/UsersCompanyRepository");
const find_by_token_service_1 = require("./services/invites/find-by-token/find-by-token.service");
const update_permissions_roles_service_1 = require("./services/users/update-permissions-roles/update-permissions-roles.service");
const auth_module_1 = require("../auth/auth.module");
const find_all_service_1 = require("./services/users/find-all/find-all.service");
const find_by_companyId_service_1 = require("./services/invites/find-by-companyId/find-by-companyId.service");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController, invites_controller_1.InvitesController],
        imports: [(0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        providers: [
            HashProvider_1.HashProvider,
            DayJSProvider_1.DayJSProvider,
            SendGridProvider_1.SendGridProvider,
            UsersRepository_1.UsersRepository,
            create_user_service_1.CreateUserService,
            update_user_service_1.UpdateUserService,
            reset_password_service_1.ResetPasswordService,
            find_by_id_service_1.FindByIdService,
            find_by_email_service_1.FindByEmailService,
            find_by_companyId_service_1.FindAllByCompanyIdService,
            invite_users_service_1.InviteUsersService,
            delete_invites_service_1.DeleteInvitesService,
            find_all_service_1.FindAllByCompanyService,
            delete_expired_invites_service_1.DeleteExpiredInvitesService,
            find_me_service_1.FindMeService,
            RefreshTokensRepository_1.RefreshTokensRepository,
            InviteUsersRepository_1.InviteUsersRepository,
            UsersCompanyRepository_1.UsersCompanyRepository,
            find_by_token_service_1.FindByTokenService,
            update_permissions_roles_service_1.UpdatePermissionsRolesService,
        ],
        exports: [UsersRepository_1.UsersRepository],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map