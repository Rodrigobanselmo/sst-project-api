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
exports.RiskDataController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const delete_many_risk_data_service_1 = require("../../services/risk-data/delete-many-risk-data/delete-many-risk-data.service");
const find_all_action_plan_service_1 = require("../../services/risk-data/find-all-action-plan/find-all-action-plan.service");
const find_by_group_risk_service_1 = require("../../services/risk-data/find-by-group-risk/find-by-group-risk.service");
const find_by_hierarchy_service_1 = require("../../services/risk-data/find-by-hierarchy/find-by-hierarchy.service");
const find_by_homogeneous_group_service_1 = require("../../services/risk-data/find-by-homogeneous-group/find-by-homogeneous-group.service");
const upsert_many_risk_data_service_1 = require("../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service");
const upsert_risk_service_1 = require("../../services/risk-data/upsert-risk-data/upsert-risk.service");
const risk_data_dto_1 = require("../../dto/risk-data.dto");
let RiskDataController = class RiskDataController {
    constructor(upsertRiskDataService, upsertManyRiskDataService, findAllByGroupAndRiskService, findAllByHomogeneousGroupService, findAllByHierarchyService, deleteManyRiskDataService, findAllActionPlanService) {
        this.upsertRiskDataService = upsertRiskDataService;
        this.upsertManyRiskDataService = upsertManyRiskDataService;
        this.findAllByGroupAndRiskService = findAllByGroupAndRiskService;
        this.findAllByHomogeneousGroupService = findAllByHomogeneousGroupService;
        this.findAllByHierarchyService = findAllByHierarchyService;
        this.deleteManyRiskDataService = deleteManyRiskDataService;
        this.findAllActionPlanService = findAllActionPlanService;
    }
    upsert(upsertRiskDataDto) {
        return this.upsertRiskDataService.execute(upsertRiskDataDto);
    }
    upsertMany(upsertRiskDataDto) {
        return this.upsertManyRiskDataService.execute(upsertRiskDataDto);
    }
    findActionPlan(userPayloadDto, groupId, workspaceId, query) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findAllActionPlanService.execute(groupId, workspaceId, companyId, query);
    }
    findAllAvailableByHomogenousGroup(userPayloadDto, groupId, homogeneousGroupId) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findAllByHomogeneousGroupService.execute(homogeneousGroupId, groupId, companyId);
    }
    findAllAvailableByHierarchy(userPayloadDto, hierarchyId) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findAllByHierarchyService.execute(hierarchyId, companyId);
    }
    findAllAvailable(userPayloadDto, riskId, groupId) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findAllByGroupAndRiskService.execute(riskId, groupId, companyId);
    }
    delete(upsertRiskDataDto, companyId) {
        return this.deleteManyRiskDataService.execute(upsertRiskDataDto, companyId);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        crud: 'cu',
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_data_dto_1.UpsertRiskDataDto]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "upsert", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        crud: 'cu',
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)('many'),
    openapi.ApiResponse({ status: 201, type: [[require("../../entities/riskData.entity").RiskFactorDataEntity]] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_data_dto_1.UpsertManyRiskDataDto]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "upsertMany", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        isContract: true,
        isMember: true,
    }, {
        code: authorization_1.PermissionEnum.ACTION_PLAN,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/action-plan/:companyId/:workspaceId/:riskGroupId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('riskGroupId')),
    __param(2, (0, common_1.Param)('workspaceId')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String, String, risk_data_dto_1.FindRiskDataDto]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "findActionPlan", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:companyId/:groupId/homogeneous/:homogeneousGroupId'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/riskData.entity").RiskFactorDataEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('groupId')),
    __param(2, (0, common_1.Param)('homogeneousGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String, String]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "findAllAvailableByHomogenousGroup", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:companyId/hierarchy/:hierarchyId'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/riskData.entity").RiskFactorDataEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('hierarchyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "findAllAvailableByHierarchy", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:companyId/:riskGroupId/:riskId'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/riskData.entity").RiskFactorDataEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('riskId')),
    __param(2, (0, common_1.Param)('riskGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String, String]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "findAllAvailable", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        crud: 'd',
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)('/:companyId/:groupId/delete/many'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_data_dto_1.DeleteManyRiskDataDto, String]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "delete", null);
RiskDataController = __decorate([
    (0, common_1.Controller)('risk-data'),
    __metadata("design:paramtypes", [upsert_risk_service_1.UpsertRiskDataService,
        upsert_many_risk_data_service_1.UpsertManyRiskDataService,
        find_by_group_risk_service_1.FindAllByGroupAndRiskService,
        find_by_homogeneous_group_service_1.FindAllByHomogeneousGroupService,
        find_by_hierarchy_service_1.FindAllByHierarchyService,
        delete_many_risk_data_service_1.DeleteManyRiskDataService,
        find_all_action_plan_service_1.FindAllActionPlanService])
], RiskDataController);
exports.RiskDataController = RiskDataController;
//# sourceMappingURL=risk-data.controller.js.map