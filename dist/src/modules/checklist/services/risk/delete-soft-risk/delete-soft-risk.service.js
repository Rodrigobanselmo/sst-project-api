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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSoftRiskService = void 0;
const common_1 = require("@nestjs/common");
const RiskRepository_1 = require("../../../repositories/implementations/RiskRepository");
const isMater_1 = require("../../../../../shared/utils/isMater");
let DeleteSoftRiskService = class DeleteSoftRiskService {
    constructor(riskRepository) {
        this.riskRepository = riskRepository;
    }
    async execute(id, userPayloadDto) {
        const user = (0, isMater_1.isMaster)(userPayloadDto);
        const companyId = user.companyId;
        let risk;
        if (user.isMaster) {
            risk = await this.riskRepository.DeleteByIdSoft(id);
        }
        else {
            risk = await this.riskRepository.DeleteByCompanyAndIdSoft(id, companyId);
        }
        if (!risk.id)
            throw new common_1.NotFoundException('data not found');
        return risk;
    }
};
DeleteSoftRiskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskRepository_1.RiskRepository])
], DeleteSoftRiskService);
exports.DeleteSoftRiskService = DeleteSoftRiskService;
//# sourceMappingURL=delete-soft-risk.service.js.map