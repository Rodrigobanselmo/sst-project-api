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
exports.InvitesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const errorMessage_1 = require("../../../../shared/constants/enum/errorMessage");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const validate_email_pipe_1 = require("../../../../shared/pipes/validate-email.pipe");
const invite_user_dto_1 = require("../../dto/invite-user.dto");
const delete_expired_invites_service_1 = require("../../services/invites/delete-expired-invites/delete-expired-invites.service");
const delete_invites_service_1 = require("../../services/invites/delete-invites/delete-invites.service");
const find_available_service_1 = require("../../services/invites/find-available/find-available.service");
const find_by_companyId_service_1 = require("../../services/invites/find-by-companyId/find-by-companyId.service");
const find_by_email_service_1 = require("../../services/invites/find-by-email/find-by-email.service");
const find_by_token_service_1 = require("../../services/invites/find-by-token/find-by-token.service");
const invite_users_service_1 = require("../../services/invites/invite-users/invite-users.service");
let InvitesController = class InvitesController {
    constructor(inviteUsersService, findAllByCompanyIdService, findAllByEmailService, findAvailableService, findByTokenService, deleteInvitesService, deleteExpiredInvitesService) {
        this.inviteUsersService = inviteUsersService;
        this.findAllByCompanyIdService = findAllByCompanyIdService;
        this.findAllByEmailService = findAllByEmailService;
        this.findAvailableService = findAvailableService;
        this.findByTokenService = findByTokenService;
        this.deleteInvitesService = deleteInvitesService;
        this.deleteExpiredInvitesService = deleteExpiredInvitesService;
    }
    async findAllByCompany(user) {
        return (0, class_transformer_1.classToClass)(this.findAllByCompanyIdService.execute(user.targetCompanyId));
    }
    async findAllByEmail(email, user) {
        if (user.email !== email)
            throw new common_1.ForbiddenException(errorMessage_1.ErrorInvitesEnum.FORBIDDEN_ACCESS_USER_INVITE_LIST);
        return (0, class_transformer_1.classToClass)(this.findAllByEmailService.execute(email));
    }
    async findByToken(tokenId) {
        return (0, class_transformer_1.classToClass)(this.findByTokenService.execute(tokenId));
    }
    async find(user, query) {
        return (0, class_transformer_1.classToClass)(this.findAvailableService.execute(query, user));
    }
    async invite(inviteUserDto, user) {
        return (0, class_transformer_1.classToClass)(this.inviteUsersService.execute(inviteUserDto, user));
    }
    async delete(id, user) {
        await this.deleteInvitesService.execute({
            id,
            companyId: user.targetCompanyId,
        });
        return id;
    }
    deleteAll() {
        return this.deleteExpiredInvitesService.execute();
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/invite-users.entity").InviteUsersEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "findAllByCompany", null);
__decorate([
    (0, common_1.Get)('/me/:email'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/invite-users.entity").InviteUsersEntity] }),
    __param(0, (0, common_1.Param)('email', validate_email_pipe_1.ValidateEmailPipe)),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "findAllByEmail", null);
__decorate([
    (0, common_1.Get)('/token/:tokenId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/invite-users.entity").InviteUsersEntity }),
    __param(0, (0, common_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "findByToken", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, invite_user_dto_1.FindInvitesDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        isMember: true,
        isContract: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/invite-users.entity").InviteUsersEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_user_dto_1.InviteUserDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "invite", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        isMember: true,
        crud: true,
        isContract: true,
    }),
    (0, common_1.Delete)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('expired'),
    (0, swagger_1.ApiBearerAuth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvitesController.prototype, "deleteAll", null);
InvitesController = __decorate([
    (0, swagger_1.ApiTags)('invites'),
    (0, common_1.Controller)('invites'),
    __metadata("design:paramtypes", [invite_users_service_1.InviteUsersService,
        find_by_companyId_service_1.FindAllByCompanyIdService,
        find_by_email_service_1.FindAllByEmailService,
        find_available_service_1.FindAvailableService,
        find_by_token_service_1.FindByTokenService,
        delete_invites_service_1.DeleteInvitesService,
        delete_expired_invites_service_1.DeleteExpiredInvitesService])
], InvitesController);
exports.InvitesController = InvitesController;
//# sourceMappingURL=invites.controller.js.map