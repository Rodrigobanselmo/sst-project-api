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
exports.UpsertRiskDocInfoService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../../company/repositories/implementations/EmployeePPPHistoryRepository");
const RiskRepository_1 = require("../../../repositories/implementations/RiskRepository");
const common_1 = require("@nestjs/common");
const RiskDocInfoRepository_1 = require("../../../repositories/implementations/RiskDocInfoRepository");
let UpsertRiskDocInfoService = class UpsertRiskDocInfoService {
    constructor(riskDocInfoRepository, riskRepository, employeePPPHistoryRepository) {
        this.riskDocInfoRepository = riskDocInfoRepository;
        this.riskRepository = riskRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(upsertRiskDataDto, user) {
        if (user.isMaster && user.targetCompanyId === user.companyId) {
            const risk = await this.riskRepository.update({
                companyId: user.targetCompanyId,
                id: upsertRiskDataDto.riskId,
                isAso: upsertRiskDataDto.isAso,
                isPGR: upsertRiskDataDto.isPGR,
                isPPP: upsertRiskDataDto.isPPP,
                isPCMSO: upsertRiskDataDto.isPCMSO,
            }, true, user.targetCompanyId);
            if (upsertRiskDataDto.isPPP)
                this.employeePPPHistoryRepository.updateManyNude({
                    data: { sendEvent: true },
                    where: {
                        employee: {
                            hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroup: { riskFactorData: { some: { riskId: upsertRiskDataDto.riskId } } } } } },
                        },
                    },
                });
            return risk;
        }
        const riskDocInfo = upsertRiskDataDto.hierarchyId
            ? {}
            : await this.riskDocInfoRepository.findFirstNude({
                where: {
                    companyId: user.targetCompanyId,
                    riskId: upsertRiskDataDto.riskId,
                },
            });
        const data = await this.riskDocInfoRepository.upsert(Object.assign(Object.assign({}, upsertRiskDataDto), { companyId: user.targetCompanyId, id: riskDocInfo === null || riskDocInfo === void 0 ? void 0 : riskDocInfo.id }));
        if (upsertRiskDataDto.isPPP)
            this.employeePPPHistoryRepository.updateManyNude({
                data: { sendEvent: true },
                where: {
                    employee: {
                        companyId: user.targetCompanyId,
                        hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroup: { riskFactorData: { some: { riskId: upsertRiskDataDto.riskId } } } } } },
                    },
                },
            });
        return data;
    }
};
UpsertRiskDocInfoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskDocInfoRepository_1.RiskDocInfoRepository,
        RiskRepository_1.RiskRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], UpsertRiskDocInfoService);
exports.UpsertRiskDocInfoService = UpsertRiskDocInfoService;
//# sourceMappingURL=upsert-risk-doc-info.service.js.map