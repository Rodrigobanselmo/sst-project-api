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
exports.UpsertRiskDataService = void 0;
const common_1 = require("@nestjs/common");
const RiskDataRepository_1 = require("../../../repositories/implementations/RiskDataRepository");
let UpsertRiskDataService = class UpsertRiskDataService {
    constructor(riskDataRepository) {
        this.riskDataRepository = riskDataRepository;
    }
    async execute(upsertRiskDataDto) {
        const keepEmpty = upsertRiskDataDto.keepEmpty;
        delete upsertRiskDataDto.keepEmpty;
        const riskData = await this.riskDataRepository.upsert(upsertRiskDataDto);
        if (!keepEmpty) {
            const isEmpty = riskData.adms.length === 0 &&
                riskData.recs.length === 0 &&
                riskData.engs.length === 0 &&
                riskData.epis.length === 0 &&
                riskData.generateSources.length === 0 &&
                !riskData.probability;
            if (isEmpty) {
                await this.riskDataRepository.deleteById(riskData.id);
                return riskData.id;
            }
        }
        return riskData;
    }
};
UpsertRiskDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskDataRepository_1.RiskDataRepository])
], UpsertRiskDataService);
exports.UpsertRiskDataService = UpsertRiskDataService;
//# sourceMappingURL=upsert-risk.service.js.map