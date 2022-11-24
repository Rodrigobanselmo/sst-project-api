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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyHomoGroupService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../repositories/implementations/EmployeePPPHistoryRepository");
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const HomoGroupRepository_1 = require("../../../repositories/implementations/HomoGroupRepository");
const asyncEach_1 = require("./../../../../../shared/utils/asyncEach");
const RiskDataRepository_1 = require("../../../../sst/repositories/implementations/RiskDataRepository");
const upsert_many_risk_data_service_1 = require("../../../../sst/services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service");
let CopyHomoGroupService = class CopyHomoGroupService {
    constructor(employeePPPHistoryRepository, homoGroupRepository, riskDataRepository, upsertManyRiskDataService) {
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
        this.homoGroupRepository = homoGroupRepository;
        this.riskDataRepository = riskDataRepository;
        this.upsertManyRiskDataService = upsertManyRiskDataService;
    }
    async execute(_a, userPayloadDto) {
        var { actualGroupId, riskGroupId, copyFromHomoGroupId, riskGroupIdFrom, companyIdFrom, hierarchyId } = _a, rest = __rest(_a, ["actualGroupId", "riskGroupId", "copyFromHomoGroupId", "riskGroupIdFrom", "companyIdFrom", "hierarchyId"]);
        const companyId = userPayloadDto.targetCompanyId;
        const getRiskData = async () => {
            if (actualGroupId) {
                const foundCopyFromHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(copyFromHomoGroupId, companyIdFrom);
                if (!(foundCopyFromHomoGroup === null || foundCopyFromHomoGroup === void 0 ? void 0 : foundCopyFromHomoGroup.id))
                    throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.GHO_NOT_FOUND);
                return this.riskDataRepository.findAllByHomogeneousGroupId(companyIdFrom, riskGroupIdFrom, foundCopyFromHomoGroup.id);
            }
            if (hierarchyId) {
                return this.riskDataRepository.findAllByHierarchyId(companyIdFrom, hierarchyId);
            }
        };
        const foundHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(actualGroupId, companyId);
        if (!foundHomoGroup.type) {
        }
        const save = async (riskData, index) => {
            var _a, _b, _c, _d, _e;
            const data = Object.assign({ riskId: riskData.riskId, companyId, homogeneousGroupIds: [actualGroupId], riskFactorGroupDataId: riskGroupId, hierarchyIds: [], riskIds: [], adms: !(((_a = riskData === null || riskData === void 0 ? void 0 : riskData.adms) === null || _a === void 0 ? void 0 : _a.length) > 0) ? undefined : riskData.adms.map(({ id }) => id), engs: !(((_b = riskData === null || riskData === void 0 ? void 0 : riskData.engsToRiskFactorData) === null || _b === void 0 ? void 0 : _b.length) > 0) ? undefined : riskData.engsToRiskFactorData.map((_a) => {
                    var { recMed } = _a, rest = __rest(_a, ["recMed"]);
                    return rest;
                }), epis: !(((_c = riskData === null || riskData === void 0 ? void 0 : riskData.epiToRiskFactorData) === null || _c === void 0 ? void 0 : _c.length) > 0) ? undefined : riskData.epiToRiskFactorData.map((_a) => {
                    var { epi } = _a, rest = __rest(_a, ["epi"]);
                    return rest;
                }), recs: !(((_d = riskData === null || riskData === void 0 ? void 0 : riskData.recs) === null || _d === void 0 ? void 0 : _d.length) > 0) ? undefined : riskData.recs.map(({ id }) => id), generateSources: !(((_e = riskData === null || riskData === void 0 ? void 0 : riskData.generateSources) === null || _e === void 0 ? void 0 : _e.length) > 0) ? undefined : riskData.generateSources.map(({ id }) => id), probability: riskData.probability || undefined, probabilityAfter: riskData.probabilityAfter || undefined, json: riskData.json || undefined }, rest);
            if (!(foundHomoGroup === null || foundHomoGroup === void 0 ? void 0 : foundHomoGroup.id) && index === 0)
                return this.upsertManyRiskDataService.execute(data);
            delete data.type;
            delete data.workspaceId;
            return this.riskDataRepository.upsertMany(data);
        };
        const riskData = await getRiskData();
        await (0, asyncEach_1.asyncEach)(riskData.filter((r) => r.endDate == null), save);
        this.employeePPPHistoryRepository.updateManyNude({
            data: { sendEvent: true },
            where: {
                employee: {
                    companyId: userPayloadDto.targetCompanyId,
                    hierarchyHistory: { some: { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: foundHomoGroup.id } } } } },
                },
            },
        });
    }
};
CopyHomoGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository,
        HomoGroupRepository_1.HomoGroupRepository,
        RiskDataRepository_1.RiskDataRepository,
        upsert_many_risk_data_service_1.UpsertManyRiskDataService])
], CopyHomoGroupService);
exports.CopyHomoGroupService = CopyHomoGroupService;
//# sourceMappingURL=copy-homo-group.service.js.map