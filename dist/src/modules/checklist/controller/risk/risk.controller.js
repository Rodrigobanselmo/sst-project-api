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
exports.RiskController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const risk_dto_1 = require("../../dto/risk.dto");
const create_risk_service_1 = require("../../services/risk/create-risk/create-risk.service");
const delete_soft_risk_service_1 = require("../../services/risk/delete-soft-risk/delete-soft-risk.service");
const find_all_available_risk_service_1 = require("../../services/risk/find-all-available-risk/find-all-available-risk.service");
const update_risk_service_1 = require("../../services/risk/update-risk/update-risk.service");
let RiskController = class RiskController {
    constructor(createRiskService, updateRiskService, findAllAvailableRiskService, deleteSoftRiskService) {
        this.createRiskService = createRiskService;
        this.updateRiskService = updateRiskService;
        this.findAllAvailableRiskService = findAllAvailableRiskService;
        this.deleteSoftRiskService = deleteSoftRiskService;
    }
    create(userPayloadDto, createRiskDto) {
        return this.createRiskService.execute(createRiskDto, userPayloadDto);
    }
    async update(riskId, userPayloadDto, updateRiskDto) {
        return this.updateRiskService.execute(riskId, updateRiskDto, userPayloadDto);
    }
    findAllAvailable(userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findAllAvailableRiskService.execute(companyId);
    }
    async deleteSoft(riskId, userPayloadDto) {
        return this.deleteSoftRiskService.execute(riskId, userPayloadDto);
    }
};
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/risk.entity").RiskFactorsEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto,
        risk_dto_1.CreateRiskDto]),
    __metadata("design:returntype", void 0)
], RiskController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('/:riskId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/risk.entity").RiskFactorsEntity }),
    __param(0, (0, common_1.Param)('riskId')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto,
        risk_dto_1.UpdateRiskDto]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/risk.entity").RiskFactorsEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], RiskController.prototype, "findAllAvailable", null);
__decorate([
    (0, common_1.Delete)('/:riskId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/risk.entity").RiskFactorsEntity }),
    __param(0, (0, common_1.Param)('riskId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "deleteSoft", null);
RiskController = __decorate([
    (0, common_1.Controller)('risk'),
    __metadata("design:paramtypes", [create_risk_service_1.CreateRiskService,
        update_risk_service_1.UpdateRiskService,
        find_all_available_risk_service_1.FindAllAvailableRiskService,
        delete_soft_risk_service_1.DeleteSoftRiskService])
], RiskController);
exports.RiskController = RiskController;
//# sourceMappingURL=risk.controller.js.map