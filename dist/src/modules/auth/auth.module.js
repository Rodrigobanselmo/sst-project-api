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
const HashProvider_1 = require("../../shared/providers/HashProvider/implementations/HashProvider");
const AwsSesProvider_1 = require("../../shared/providers/MailProvider/implementations/AwsSes/AwsSesProvider");
const JwtTokenProvider_1 = require("../../shared/providers/TokenProvider/implementations/JwtTokenProvider");
const users_module_1 = require("../users/users.module");
const auth_controller_1 = require("./controller/auth.controller");
const authorization_test_controller_1 = require("./controller/authorization-test/authorization-test.controller");
const RefreshTokensRepository_1 = require("./repositories/implementations/RefreshTokensRepository");
const delete_all_expired_service_1 = require("./services/delete-all-expired/delete-all-expired.service");
const refresh_token_service_1 = require("./services/refresh-token/refresh-token.service");
const send_forgot_pass_mail_service_1 = require("./services/send-forgot-pass-mail/send-forgot-pass-mail.service");
const session_service_1 = require("./services/session/session.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            users_module_1.UsersModule,
            jwt_1.JwtModule.register({
                secret: process.env.TOKEN_SECRET,
                signOptions: {
                    expiresIn: process.env.TOKEN_EXPIRES,
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController, authorization_test_controller_1.AuthorizationTestController],
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
            AwsSesProvider_1.AwsSesProvider,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map