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
exports.RiskDataRecController = void 0;
const openapi = require("@nestjs/swagger");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const common_1 = require("@nestjs/common");
const risk_data_rec_dto_1 = require("../../dto/risk-data-rec.dto");
const upsert_risk_data_rec_service_1 = require("../../services/risk-data-rec/upsert-risk-data-rec/upsert-risk-data-rec.service");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
let RiskDataRecController = class RiskDataRecController {
    constructor(upsertRiskDataRecService) {
        this.upsertRiskDataRecService = upsertRiskDataRecService;
    }
    upsert(upsertRiskDataDto, userPayloadDto) {
        return this.upsertRiskDataRecService.execute(upsertRiskDataDto, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.RISK_DATA,
        crud: true,
        isContract: true,
        isMember: true,
    }, {
        code: authorization_1.PermissionEnum.ACTION_PLAN,
        crud: 'cu',
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/riskDataRec.entity").RiskDataRecEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [risk_data_rec_dto_1.UpsertRiskDataRecDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], RiskDataRecController.prototype, "upsert", null);
RiskDataRecController = __decorate([
    (0, common_1.Controller)('risk-data-rec'),
    __metadata("design:paramtypes", [upsert_risk_data_rec_service_1.UpsertRiskDataRecService])
], RiskDataRecController);
exports.RiskDataRecController = RiskDataRecController;
//# sourceMappingURL=risk-data-rec.controller.js.map