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
const EmployeePPPHistoryRepository_1 = require("./../../../../company/repositories/implementations/EmployeePPPHistoryRepository");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const HomoGroupRepository_1 = require("../../../../company/repositories/implementations/HomoGroupRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const RiskDataRepository_1 = require("../../../repositories/implementations/RiskDataRepository");
const upsert_risk_service_1 = require("../upsert-risk-data/upsert-risk.service");
let UpsertManyRiskDataService = class UpsertManyRiskDataService {
    constructor(riskDataRepository, homoGroupRepository, hierarchyRepository, employeePPPHistoryRepository) {
        this.riskDataRepository = riskDataRepository;
        this.homoGroupRepository = homoGroupRepository;
        this.hierarchyRepository = hierarchyRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(upsertRiskDataDto) {
        (await Promise.all(upsertRiskDataDto.homogeneousGroupIds.map(async (homogeneousGroupId, index) => {
            const workspaceId = upsertRiskDataDto.workspaceIds ? upsertRiskDataDto.workspaceIds[index] : upsertRiskDataDto.workspaceId;
            const type = upsertRiskDataDto.type;
            const isTypeHierarchy = type && type == client_1.HomoTypeEnum.HIERARCHY;
            if (isTypeHierarchy && workspaceId) {
                await (0, upsert_risk_service_1.hierarchyCreateHomo)({
                    homogeneousGroupId: homogeneousGroupId,
                    companyId: upsertRiskDataDto.companyId,
                    homoGroupRepository: this.homoGroupRepository,
                    hierarchyRepository: this.hierarchyRepository,
                    type,
                    workspaceId,
                });
            }
        }))) || [];
        delete upsertRiskDataDto.workspaceIds;
        delete upsertRiskDataDto.workspaceId;
        delete upsertRiskDataDto.type;
        if ('startDate' in upsertRiskDataDto) {
            if (!upsertRiskDataDto.startDate)
                upsertRiskDataDto.startDate = null;
        }
        if ('endDate' in upsertRiskDataDto) {
            if (!upsertRiskDataDto.endDate)
                upsertRiskDataDto.endDate = null;
        }
        const risksDataMany = (await Promise.all(upsertRiskDataDto.riskIds.map(async (riskId) => {
            return await this.riskDataRepository.upsertConnectMany(Object.assign(Object.assign({}, upsertRiskDataDto), { riskId }));
        }))) || [];
        if (upsertRiskDataDto.riskId)
            risksDataMany.push(await this.riskDataRepository.upsertMany(upsertRiskDataDto));
        this.employeePPPHistoryRepository.updateManyNude({
            data: { sendEvent: true },
            where: {
                employee: {
                    companyId: upsertRiskDataDto.companyId,
                    hierarchyHistory: { some: { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: upsertRiskDataDto.homogeneousGroupIds } } } } } },
                },
            },
        });
        return risksDataMany;
    }
};
UpsertManyRiskDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskDataRepository_1.RiskDataRepository,
        HomoGroupRepository_1.HomoGroupRepository,
        HierarchyRepository_1.HierarchyRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], UpsertManyRiskDataService);
exports.UpsertManyRiskDataService = UpsertManyRiskDataService;
//# sourceMappingURL=upsert-many-risk-data.service.js.map