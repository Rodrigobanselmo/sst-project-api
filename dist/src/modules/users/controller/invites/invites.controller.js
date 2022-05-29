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
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const invite_user_dto_1 = require("../../dto/invite-user.dto");
const delete_expired_invites_service_1 = require("../../services/invites/delete-expired-invites/delete-expired-invites.service");
const delete_invites_service_1 = require("../../services/invites/delete-invites/delete-invites.service");
const find_by_companyId_service_1 = require("../../services/invites/find-by-companyId/find-by-companyId.service");
const invite_users_service_1 = require("../../services/invites/invite-users/invite-users.service");
const delete_invite_dto_1 = require("./../../dto/delete-invite.dto");
let InvitesController = class InvitesController {
    constructor(inviteUsersService, findAllByCompanyIdService, deleteInvitesService, deleteExpiredInvitesService) {
        this.inviteUsersService = inviteUsersService;
        this.findAllByCompanyIdService = findAllByCompanyIdService;
        this.deleteInvitesService = deleteInvitesService;
        this.deleteExpiredInvitesService = deleteExpiredInvitesService;
    }
    async findAllByCompany(user) {
        return (0, class_transformer_1.classToClass)(this.findAllByCompanyIdService.execute(user.targetCompanyId));
    }
    async invite(inviteUserDto) {
        return (0, class_transformer_1.classToClass)(this.inviteUsersService.execute(inviteUserDto));
    }
    async delete(deleteInviteDto) {
        return (0, class_transformer_1.classToClass)(this.deleteInvitesService.execute(deleteInviteDto));
    }
    deleteAll() {
        return this.deleteExpiredInvitesService.execute();
    }
};
__decorate([
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/invite-users.entity").InviteUsersEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "findAllByCompany", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.INVITE_USER,
        isMember: true,
        isContract: true,
    }),
    openapi.ApiResponse({ status: 201, type: require("../../entities/invite-users.entity").InviteUsersEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_user_dto_1.InviteUserDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "invite", null);
__decorate([
    (0, common_1.Delete)(),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.INVITE_USER,
        isMember: true,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_invite_dto_1.DeleteInviteDto]),
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
        delete_invites_service_1.DeleteInvitesService,
        delete_expired_invites_service_1.DeleteExpiredInvitesService])
], InvitesController);
exports.InvitesController = InvitesController;
//# sourceMappingURL=invites.controller.js.map