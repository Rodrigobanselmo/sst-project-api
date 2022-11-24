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
exports.AuthGroupController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_group_dto_1 = require("../../dto/access-group.dto");
const upsert_access_group_service_1 = require("../../services/group/find-available-access-group/upsert-access-group.service");
const upsert_access_group_service_2 = require("../../services/group/upsert-access-group/upsert-access-group.service");
const user_decorator_1 = require("./../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("./../../../../shared/dto/user-payload.dto");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
let AuthGroupController = class AuthGroupController {
    constructor(findAvailableAccessGroupsService, upsertAccessGroupsService) {
        this.findAvailableAccessGroupsService = findAvailableAccessGroupsService;
        this.upsertAccessGroupsService = upsertAccessGroupsService;
    }
    find(userPayloadDto, query) {
        return this.findAvailableAccessGroupsService.execute(query, userPayloadDto);
    }
    upsert(upsertAccessGroupDto, userPayloadDto) {
        return this.upsertAccessGroupsService.execute(upsertAccessGroupDto, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.ACCESS_GROUP,
        crud: true,
        isMember: true,
    }, {
        code: authorization_1.PermissionEnum.USER,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, access_group_dto_1.FindAccessGroupDto]),
    __metadata("design:returntype", void 0)
], AuthGroupController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.ACCESS_GROUP,
        crud: 'cu',
        isMember: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/access-groups.entity").AccessGroupsEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [access_group_dto_1.UpsertAccessGroupDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], AuthGroupController.prototype, "upsert", null);
AuthGroupController = __decorate([
    (0, swagger_1.ApiTags)('access-group'),
    (0, common_1.Controller)('auth/group/:companyId'),
    __metadata("design:paramtypes", [upsert_access_group_service_1.FindAvailableAccessGroupsService,
        upsert_access_group_service_2.UpsertAccessGroupsService])
], AuthGroupController);
exports.AuthGroupController = AuthGroupController;
//# sourceMappingURL=group.controller.js.map