"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../../../shared/decorators/public.decorator");
const forgot_password_1 = require("../../dto/forgot-password");
const login_user_dto_1 = require("../../dto/login-user.dto");
const refresh_token_dto_1 = require("../../dto/refresh-token.dto");
const delete_all_expired_service_1 = require("../../services/session/delete-all-expired/delete-all-expired.service");
const refresh_token_service_1 = require("../../services/session/refresh-token/refresh-token.service");
const send_forgot_pass_mail_service_1 = require("../../services/session/send-forgot-pass-mail/send-forgot-pass-mail.service");
const session_service_1 = require("../../services/session/session/session.service");
const verify_google_login_service_1 = require("../../services/session/verify-google-login/verify-google-login.service");
let AuthController = class AuthController {
    constructor(sessionService, refreshTokenService, sendForgotPassMailService, deleteAllExpiredRefreshTokensService, verifyGoogleLoginService) {
        this.sessionService = sessionService;
        this.refreshTokenService = refreshTokenService;
        this.sendForgotPassMailService = sendForgotPassMailService;
        this.deleteAllExpiredRefreshTokensService = deleteAllExpiredRefreshTokensService;
        this.verifyGoogleLoginService = verifyGoogleLoginService;
    }
    async session(loginUserDto) {
        return this.sessionService.execute(loginUserDto);
    }
    async google(loginUserDto) {
        const user = await this.verifyGoogleLoginService.execute(loginUserDto);
        return this.sessionService.execute({ email: user.email, userEntity: user });
    }
    refresh({ refresh_token, companyId }) {
        return this.refreshTokenService.execute(refresh_token, companyId);
    }
    forgot({ email }) {
        return this.sendForgotPassMailService.execute(email);
    }
    deleteAll() {
        return this.deleteAllExpiredRefreshTokensService.execute();
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('session'),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "session", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('session/google'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginGoogleUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "google", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgot", null);
__decorate([
    (0, common_1.Delete)('auth/expired-refresh-tokens'),
    (0, swagger_1.ApiBearerAuth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "deleteAll", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [session_service_1.SessionService,
        refresh_token_service_1.RefreshTokenService,
        send_forgot_pass_mail_service_1.SendForgotPassMailService,
        delete_all_expired_service_1.DeleteAllExpiredService,
        verify_google_login_service_1.VerifyGoogleLoginService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map