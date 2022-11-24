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
exports.CompanyGroupController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const company_group_dto_1 = require("../../dto/company-group.dto");
const find_company_groups_group_service_1 = require("../../services/group/find-company-groups-group/find-company-groups-group.service");
const upsert_company_group_service_1 = require("../../services/group/upsert-company-group/upsert-company-group.service");
const user_decorator_1 = require("./../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("./../../../../shared/dto/user-payload.dto");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const roles_decorator_1 = require("../../../../shared/decorators/roles.decorator");
let CompanyGroupController = class CompanyGroupController {
    constructor(upsertCompanyGroupsService, findAvailableCompanyGroupsService) {
        this.upsertCompanyGroupsService = upsertCompanyGroupsService;
        this.findAvailableCompanyGroupsService = findAvailableCompanyGroupsService;
    }
    find(userPayloadDto, query) {
        return this.findAvailableCompanyGroupsService.execute(query, userPayloadDto);
    }
    upsert(upsertAccessGroupDto, userPayloadDto) {
        return this.upsertCompanyGroupsService.execute(upsertAccessGroupDto, userPayloadDto);
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.COMPANY, authorization_1.RoleEnum.CONTRACTS, authorization_1.RoleEnum.USER),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, company_group_dto_1.FindCompanyGroupDto]),
    __metadata("design:returntype", void 0)
], CompanyGroupController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY_GROUPS,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/company-group.entity").CompanyGroupEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_group_dto_1.UpsertCompanyGroupDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyGroupController.prototype, "upsert", null);
CompanyGroupController = __decorate([
    (0, swagger_1.ApiTags)('company-group'),
    (0, common_1.Controller)('company/:companyId/group'),
    __metadata("design:paramtypes", [upsert_company_group_service_1.UpsertCompanyGroupsService,
        find_company_groups_group_service_1.FindAvailableCompanyGroupsService])
], CompanyGroupController);
exports.CompanyGroupController = CompanyGroupController;
//# sourceMappingURL=group.controller.js.map