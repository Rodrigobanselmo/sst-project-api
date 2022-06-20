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
exports.HierarchyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const hierarchy_1 = require("../../dto/hierarchy");
const create_hierarchies_service_1 = require("../../services/hierarchy/create-hierarchies/create-hierarchies.service");
const delete_hierarchies_service_1 = require("../../services/hierarchy/delete-hierarchies/delete-hierarchies.service");
const find_all_hierarchies_service_1 = require("../../services/hierarchy/find-all-hierarchies/find-all-hierarchies.service");
const update_hierarchies_service_1 = require("../../services/hierarchy/update-hierarchies/update-hierarchies.service");
const upsert_many_hierarchies_service_1 = require("../../services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service");
let HierarchyController = class HierarchyController {
    constructor(findAllHierarchyService, createHierarchyService, updateHierarchyService, upsertManyHierarchyService, deleteHierarchyService) {
        this.findAllHierarchyService = findAllHierarchyService;
        this.createHierarchyService = createHierarchyService;
        this.updateHierarchyService = updateHierarchyService;
        this.upsertManyHierarchyService = upsertManyHierarchyService;
        this.deleteHierarchyService = deleteHierarchyService;
    }
    findAllAvailable(userPayloadDto) {
        return this.findAllHierarchyService.execute(userPayloadDto);
    }
    create(createHierarchyDto, userPayloadDto) {
        return this.createHierarchyService.execute(createHierarchyDto, userPayloadDto);
    }
    update(updateHierarchyDto, id, userPayloadDto) {
        return this.updateHierarchyService.execute(Object.assign({ id }, updateHierarchyDto), userPayloadDto);
    }
    upsertMany(upsertManyHierarchyDto, userPayloadDto) {
        return this.upsertManyHierarchyService.execute(upsertManyHierarchyDto.data, userPayloadDto);
    }
    delete(id, userPayloadDto) {
        return this.deleteHierarchyService.execute(id, userPayloadDto);
    }
};
__decorate([
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/hierarchy.entity").HierarchyEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HierarchyController.prototype, "findAllAvailable", null);
__decorate([
    (0, common_1.Post)(''),
    openapi.ApiResponse({ status: 201, type: require("../../entities/hierarchy.entity").HierarchyEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hierarchy_1.CreateHierarchyDto,
        user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HierarchyController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/hierarchy.entity").HierarchyEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hierarchy_1.UpdateHierarchyDto, String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HierarchyController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('upsert-many'),
    openapi.ApiResponse({ status: 201, type: [require("../../entities/hierarchy.entity").HierarchyEntity] }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hierarchy_1.UpsertManyHierarchyDto,
        user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HierarchyController.prototype, "upsertMany", null);
__decorate([
    (0, common_1.Delete)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], HierarchyController.prototype, "delete", null);
HierarchyController = __decorate([
    (0, common_1.Controller)('hierarchy'),
    __metadata("design:paramtypes", [find_all_hierarchies_service_1.FindAllHierarchyService,
        create_hierarchies_service_1.CreateHierarchyService,
        update_hierarchies_service_1.UpdateHierarchyService,
        upsert_many_hierarchies_service_1.UpsertManyHierarchyService,
        delete_hierarchies_service_1.DeleteHierarchyService])
], HierarchyController);
exports.HierarchyController = HierarchyController;
//# sourceMappingURL=hierarchy.controller.js.map