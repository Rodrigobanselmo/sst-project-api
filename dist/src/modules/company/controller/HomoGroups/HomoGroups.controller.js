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
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const homoGroup_1 = require("../../dto/homoGroup");
const create_homo_group_service_1 = require("../../services/homoGroup/create-homo-group/create-homo-group.service");
const delete_homo_group_service_1 = require("../../services/homoGroup/delete-homo-group/delete-homo-group.service");
const find_by_company_homo_group_service_1 = require("../../services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service");
const update_homo_group_service_1 = require("../../services/homoGroup/update-homo-group/update-homo-group.service");
let HomoGroupsController = class HomoGroupsController {
    constructor(findByCompanyHomoGroupService, createHomoGroupsService, updateHomoGroupsService, deleteHomoGroupsService) {
        this.findByCompanyHomoGroupService = findByCompanyHomoGroupService;
        this.createHomoGroupsService = createHomoGroupsService;
        this.updateHomoGroupsService = updateHomoGroupsService;
        this.deleteHomoGroupsService = deleteHomoGroupsService;
    }
    findByCompany(userPayloadDto) {
        return this.findByCompanyHomoGroupService.execute(userPayloadDto);
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
};
__decorate([
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/homoGroup.entity").HomoGroupEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "findByCompany", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/homoGroup.entity").HomoGroupEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [homoGroup_1.CreateHomoGroupDto,
        user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "create", null);
__decorate([
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
    (0, common_1.Delete)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HomoGroupsController.prototype, "delete", null);
HomoGroupsController = __decorate([
    (0, common_1.Controller)('homogeneous-groups'),
    __metadata("design:paramtypes", [find_by_company_homo_group_service_1.FindByCompanyHomoGroupService,
        create_homo_group_service_1.CreateHomoGroupService,
        update_homo_group_service_1.UpdateHomoGroupService,
        delete_homo_group_service_1.DeleteHomoGroupService])
], HomoGroupsController);
exports.HomoGroupsController = HomoGroupsController;
//# sourceMappingURL=HomoGroups.controller.js.map