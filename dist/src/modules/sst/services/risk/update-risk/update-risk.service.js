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
exports.UpdateRiskService = void 0;
const common_1 = require("@nestjs/common");
const RiskRepository_1 = require("../../../repositories/implementations/RiskRepository");
let UpdateRiskService = class UpdateRiskService {
    constructor(riskRepository) {
        this.riskRepository = riskRepository;
    }
    async execute(id, updateRiskDto, user) {
        const system = user.isSystem;
        const companyId = user.targetCompanyId;
        const risk = await this.riskRepository.update(Object.assign({ id }, updateRiskDto), system, companyId);
        if (!risk.id)
            throw new common_1.NotFoundException('risk not found');
        return risk;
    }
};
UpdateRiskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskRepository_1.RiskRepository])
], UpdateRiskService);
exports.UpdateRiskService = UpdateRiskService;
//# sourceMappingURL=update-risk.service.js.map