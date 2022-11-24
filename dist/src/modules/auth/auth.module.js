"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const DayJSProvider_1 = require("../../shared/providers/DateProvider/implementations/DayJSProvider");
const FirebaseProvider_1 = require("../../shared/providers/FirebaseProvider/FirebaseProvider");
const HashProvider_1 = require("../../shared/providers/HashProvider/implementations/HashProvider");
const SendGridProvider_1 = require("../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
const JwtTokenProvider_1 = require("../../shared/providers/TokenProvider/implementations/JwtTokenProvider");
const users_module_1 = require("../users/users.module");
const auth_controller_1 = require("./controller/session/auth.controller");
const authorization_test_controller_1 = require("./controller/authorization-test/authorization-test.controller");
const RefreshTokensRepository_1 = require("./repositories/implementations/RefreshTokensRepository");
const delete_all_expired_service_1 = require("./services/session/delete-all-expired/delete-all-expired.service");
const refresh_token_service_1 = require("./services/session/refresh-token/refresh-token.service");
const send_forgot_pass_mail_service_1 = require("./services/session/send-forgot-pass-mail/send-forgot-pass-mail.service");
const session_service_1 = require("./services/session/session/session.service");
const verify_google_login_service_1 = require("./services/session/verify-google-login/verify-google-login.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const AuthGroupRepository_1 = require("./repositories/implementations/AuthGroupRepository");
const upsert_access_group_service_1 = require("./services/group/find-available-access-group/upsert-access-group.service");
const upsert_access_group_service_2 = require("./services/group/upsert-access-group/upsert-access-group.service");
const group_controller_1 = require("./controller/group/group.controller");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            jwt_1.JwtModule.register({
                secret: process.env.TOKEN_SECRET,
                signOptions: {
                    expiresIn: process.env.TOKEN_EXPIRES,
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController, authorization_test_controller_1.AuthorizationTestController, group_controller_1.AuthGroupController],
        providers: [
            session_service_1.SessionService,
            refresh_token_service_1.RefreshTokenService,
            delete_all_expired_service_1.DeleteAllExpiredService,
            HashProvider_1.HashProvider,
            DayJSProvider_1.DayJSProvider,
            RefreshTokensRepository_1.RefreshTokensRepository,
            JwtTokenProvider_1.JwtTokenProvider,
            jwt_strategy_1.JwtStrategy,
            send_forgot_pass_mail_service_1.SendForgotPassMailService,
            SendGridProvider_1.SendGridProvider,
            verify_google_login_service_1.VerifyGoogleLoginService,
            FirebaseProvider_1.FirebaseProvider,
            AuthGroupRepository_1.AuthGroupRepository,
            upsert_access_group_service_1.FindAvailableAccessGroupsService,
            upsert_access_group_service_2.UpsertAccessGroupsService,
        ],
        exports: [session_service_1.SessionService, AuthGroupRepository_1.AuthGroupRepository],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map