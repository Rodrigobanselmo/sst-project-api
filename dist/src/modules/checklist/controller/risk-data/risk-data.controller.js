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
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const find_by_group_risk_service_1 = require("../../services/risk-data/find-by-group-risk/find-by-group-risk.service");
const upsert_many_risk_data_service_1 = require("../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service");
const upsert_risk_service_1 = require("../../services/risk-data/upsert-risk-data/upsert-risk.service");
const risk_data_dto_1 = require("./../../dto/risk-data.dto");
let RiskDataController = class RiskDataController {
    constructor(upsertRiskDataService, upsertManyRiskDataService, findAllByGroupAndRiskService) {
        this.upsertRiskDataService = upsertRiskDataService;
        this.upsertManyRiskDataService = upsertManyRiskDataService;
        this.findAllByGroupAndRiskService = findAllByGroupAndRiskService;
    }
    upsert(upsertRiskDataDto) {
        return this.upsertRiskDataService.execute(upsertRiskDataDto);
    }
    upsertMany(upsertRiskDataDto) {
        return this.upsertManyRiskDataService.execute(upsertRiskDataDto);
    }
    findAllAvailable(userPayloadDto, riskId, groupId) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findAllByGroupAndRiskService.execute(riskId, groupId, companyId);
    }
};
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_data_dto_1.UpsertRiskDataDto]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "upsert", null);
__decorate([
    (0, common_1.Post)('many'),
    openapi.ApiResponse({ status: 201, type: [[require("../../entities/riskData.entity").RiskFactorDataEntity]] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_data_dto_1.UpsertManyRiskDataDto]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "upsertMany", null);
__decorate([
    (0, common_1.Get)('/:companyId/:groupId/:riskId'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/riskData.entity").RiskFactorDataEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('riskId')),
    __param(2, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, String, String]),
    __metadata("design:returntype", void 0)
], RiskDataController.prototype, "findAllAvailable", null);
RiskDataController = __decorate([
    (0, common_1.Controller)('risk-data'),
    __metadata("design:paramtypes", [upsert_risk_service_1.UpsertRiskDataService,
        upsert_many_risk_data_service_1.UpsertManyRiskDataService,
        find_by_group_risk_service_1.FindAllByGroupAndRiskService])
], RiskDataController);
exports.RiskDataController = RiskDataController;
//# sourceMappingURL=risk-data.controller.js.map