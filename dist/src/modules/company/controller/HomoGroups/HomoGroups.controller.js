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
exports.HomoGroupsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const homoGroup_1 = require("../../dto/homoGroup");
const copy_homo_group_service_1 = require("../../services/homoGroup/copy-homo-group/copy-homo-group.service");
const create_homo_group_service_1 = require("../../services/homoGroup/create-homo-group/create-homo-group.service");
const delete_homo_group_service_1 = require("../../services/homoGroup/delete-homo-group/delete-homo-group.service");
const find_by_company_homo_group_service_1 = require("../../services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service");
const find_homo_group_by_id_service_1 = require("../../services/homoGroup/find-homo-group-by-id/find-homo-group-by-id.service");
const find_homo_group_service_1 = require("../../services/homoGroup/find-homo-group/find-homo-group.service");
const update_hierarchy_homo_group_service_1 = require("../../services/homoGroup/update-hierarchy-homo-group/update-hierarchy-homo-group.service");
const update_homo_group_service_1 = require("../../services/homoGroup/update-homo-group/update-homo-group.service");
let HomoGroupsController = class HomoGroupsController {
    constructor(findByCompanyHomoGroupService, findHomogenousGroupService, findHomogenousGroupByIdService, createHomoGroupsService, updateHomoGroupsService, deleteHomoGroupsService, copyHomoGroupService, updateHierarchyHomoGroupService) {
        this.findByCompanyHomoGroupService = findByCompanyHomoGroupService;
        this.findHomogenousGroupService = findHomogenousGroupService;
        this.findHomogenousGroupByIdService = findHomogenousGroupByIdService;
        this.createHomoGroupsService = createHomoGroupsService;
        this.updateHomoGroupsService = updateHomoGroupsService;
        this.deleteHomoGroupsService = deleteHomoGroupsService;
        this.copyHomoGroupService = copyHomoGroupService;
        this.updateHierarchyHomoGroupService = updateHierarchyHomoGroupService;
    }
    find(query, userPayloadDto) {
        return this.findHomogenousGroupService.execute(query, userPayloadDto);
    }
    findByCompany(userPayloadDto) {
        return this.findByCompanyHomoGroupService.execute(userPayloadDto);
    }
    findById(id, userPayloadDto) {
        return this.findHomogenousGroupByIdService.execute(id, userPayloadDto);
    }
    updateHierarchyHomo(updateHomoGroupsDto, userPayloadDto) {
        return this.updateHierarchyHomoGroupService.execute(Object.assign({}, updateHomoGroupsDto), userPayloadDto);
    }
    create(createHomoGroupsDto, userPayloadDto) {
        return this.createHomoGroupsService.execute(createHomoGroupsDto, userPayloadDto);
    }
    update(updateHomoGroupsDto, id, userPayloadDto) {
        return this.updateHomoGroupsService.execute(Object.assign({ id }, updateHomoGroupsDto), userPayloadDto);
    }
    delete(id, userPayloadDto) {
        return this.deleteHomoGroupsService.execute(id, userPayloadDto);
    }
    copy(createHomoGroupsDto, userPayloadDto) {
        return this.copyHomoGroupService.execute(createHomoGroupsDto, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [homoGroup_1.FindHomogeneousGroupDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('all/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/homoGroup.entity").HomoGroupEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "findByCompany", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)(':id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/homoGroup.entity").HomoGroupEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "findById", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/hierarchy-homo/:companyId'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [homoGroup_1.UpdateHierarchyHomoGroupDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "updateHierarchyHomo", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/homoGroup.entity").HomoGroupEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [homoGroup_1.CreateHomoGroupDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/homoGroup.entity").HomoGroupEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [homoGroup_1.UpdateHomoGroupDto, String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "delete", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.HOMO_GROUP,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.RISK_DATA,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('copy/:companyId?'),
    (0, common_1.HttpCode)(200),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [homoGroup_1.CopyHomogeneousGroupDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "copy", null);
HomoGroupsController = __decorate([
    (0, common_1.Controller)('homogeneous-groups'),
    __metadata("design:paramtypes", [find_by_company_homo_group_service_1.FindByCompanyHomoGroupService,
        find_homo_group_service_1.FindHomogenousGroupService,
        find_homo_group_by_id_service_1.FindHomogenousGroupByIdService,
        create_homo_group_service_1.CreateHomoGroupService,
        update_homo_group_service_1.UpdateHomoGroupService,
        delete_homo_group_service_1.DeleteHomoGroupService,
        copy_homo_group_service_1.CopyHomoGroupService,
        update_hierarchy_homo_group_service_1.UpdateHierarchyHomoGroupService])
], HomoGroupsController);
exports.HomoGroupsController = HomoGroupsController;
//# sourceMappingURL=HomoGroups.controller.js.map