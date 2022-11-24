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
exports.hierarchyCreateHomo = exports.UpsertRiskDataService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const HomoGroupRepository_1 = require("../../../../company/repositories/implementations/HomoGroupRepository");
const RiskDataRepository_1 = require("../../../repositories/implementations/RiskDataRepository");
const EmployeePPPHistoryRepository_1 = require("./../../../../company/repositories/implementations/EmployeePPPHistoryRepository");
let UpsertRiskDataService = class UpsertRiskDataService {
    constructor(riskDataRepository, homoGroupRepository, hierarchyRepository, employeePPPHistoryRepository) {
        this.riskDataRepository = riskDataRepository;
        this.homoGroupRepository = homoGroupRepository;
        this.hierarchyRepository = hierarchyRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(upsertRiskDataDto) {
        const keepEmpty = upsertRiskDataDto.keepEmpty;
        const workspaceId = upsertRiskDataDto.workspaceId;
        const type = upsertRiskDataDto.type;
        delete upsertRiskDataDto.keepEmpty;
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
        const isTypeHierarchy = type && type == client_1.HomoTypeEnum.HIERARCHY;
        if (isTypeHierarchy)
            await (0, exports.hierarchyCreateHomo)({
                homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId,
                companyId: upsertRiskDataDto.companyId,
                homoGroupRepository: this.homoGroupRepository,
                hierarchyRepository: this.hierarchyRepository,
                type,
                workspaceId,
            });
        const riskData = await this.riskDataRepository.upsert(upsertRiskDataDto);
        this.employeePPPHistoryRepository.updateManyNude({
            data: { sendEvent: true },
            where: {
                employee: {
                    companyId: upsertRiskDataDto.companyId,
                    hierarchyHistory: { some: { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId } } } } },
                },
            },
        });
        if (!keepEmpty) {
            const isEmpty = riskData.adms.length === 0 &&
                riskData.recs.length === 0 &&
                riskData.engs.length === 0 &&
                riskData.epis.length === 0 &&
                riskData.exams.length === 0 &&
                riskData.generateSources.length === 0 &&
                !riskData.endDate &&
                !riskData.startDate &&
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
    __metadata("design:paramtypes", [RiskDataRepository_1.RiskDataRepository,
        HomoGroupRepository_1.HomoGroupRepository,
        HierarchyRepository_1.HierarchyRepository,
        EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], UpsertRiskDataService);
exports.UpsertRiskDataService = UpsertRiskDataService;
const hierarchyCreateHomo = async ({ homoGroupRepository, hierarchyRepository, type, workspaceId, homogeneousGroupId, companyId, }) => {
    const homo = await homoGroupRepository.findHomoGroupByCompanyAndId(homogeneousGroupId, companyId);
    if (!(homo === null || homo === void 0 ? void 0 : homo.id)) {
        const hierarchy = await hierarchyRepository.findAllHierarchyByCompanyAndId(homogeneousGroupId, companyId);
        if (hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.id) {
            const gho = await homoGroupRepository.create({
                companyId: companyId,
                description: '',
                name: hierarchy.id,
                type: type,
                id: hierarchy.id,
            }, companyId);
            await hierarchyRepository.upsertMany([
                {
                    ghoName: gho.name,
                    companyId: companyId,
                    id: hierarchy.id,
                    name: hierarchy.name,
                    status: hierarchy.status,
                    type: hierarchy.type,
                    workspaceIds: workspaceId ? [workspaceId] : hierarchy.workspaceIds || [],
                },
            ], companyId);
        }
    }
};
exports.hierarchyCreateHomo = hierarchyCreateHomo;
//# sourceMappingURL=upsert-risk.service.js.map