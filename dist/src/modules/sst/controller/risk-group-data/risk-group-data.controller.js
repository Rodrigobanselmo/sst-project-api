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
exports.RiskGroupDataController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const risk_group_data_dto_1 = require("../../dto/risk-group-data.dto");
const find_by_company_service_1 = require("../../services/risk-group-data/find-by-company/find-by-company.service");
const find_by_id_service_1 = require("../../services/risk-group-data/find-by-id/find-by-id.service");
const upsert_risk_group_data_service_1 = require("../../services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
let RiskGroupDataController = class RiskGroupDataController {
    constructor(upsertRiskGroupDataService, findAllByCompanyService, findByIdService) {
        this.upsertRiskGroupDataService = upsertRiskGroupDataService;
        this.findAllByCompanyService = findAllByCompanyService;
        this.findByIdService = findByIdService;
    }
    upsert(upsertRiskGroupDataDto) {
        return this.upsertRiskGroupDataService.execute(upsertRiskGroupDataDto);
    }
    findAllAvailable(userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findAllByCompanyService.execute(companyId);
    }
    findById(id, userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findByIdService.execute(id, companyId);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: 'cu',
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_group_data_dto_1.UpsertRiskGroupDataDto]),
    __metadata("design:returntype", void 0)
], RiskGroupDataController.prototype, "upsert", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:companyId'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], RiskGroupDataController.prototype, "findAllAvailable", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:id/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], RiskGroupDataController.prototype, "findById", null);
RiskGroupDataController = __decorate([
    (0, common_1.Controller)('risk-group-data'),
    __metadata("design:paramtypes", [upsert_risk_group_data_service_1.UpsertRiskGroupDataService,
        find_by_company_service_1.FindAllByCompanyService,
        find_by_id_service_1.FindByIdService])
], RiskGroupDataController);
exports.RiskGroupDataController = RiskGroupDataController;
//# sourceMappingURL=risk-group-data.controller.js.map