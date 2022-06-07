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
exports.UpsertManyRiskDataService = void 0;
const common_1 = require("@nestjs/common");
const RiskDataRepository_1 = require("../../../repositories/implementations/RiskDataRepository");
let UpsertManyRiskDataService = class UpsertManyRiskDataService {
    constructor(riskDataRepository) {
        this.riskDataRepository = riskDataRepository;
    }
    async execute(upsertRiskDataDto) {
        const risksDataMany = await this.riskDataRepository.upsertMany(upsertRiskDataDto);
        const riskData = risksDataMany[0];
        const riskDataIds = risksDataMany.map((risk) => risk.id);
        if (riskData) {
            const isEmpty = riskData.adms.length === 0 &&
                riskData.recs.length === 0 &&
                riskData.engs.length === 0 &&
                riskData.epis.length === 0 &&
                riskData.generateSources.length === 0 &&
                !riskData.probability;
            if (isEmpty) {
                await this.riskDataRepository.deleteByIds(riskDataIds);
                return riskDataIds;
            }
        }
        return risksDataMany;
    }
};
UpsertManyRiskDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskDataRepository_1.RiskDataRepository])
], UpsertManyRiskDataService);
exports.UpsertManyRiskDataService = UpsertManyRiskDataService;
//# sourceMappingURL=upsert-many-risk-data.service.js.map