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
exports.RiskDataRepository = void 0;
const m2mFilterIds_1 = require("./../../../../shared/utils/m2mFilterIds");
const CharacterizationRepository_1 = require("../../../company/repositories/implementations/CharacterizationRepository");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const riskData_entity_1 = require("../../entities/riskData.entity");
const matriz_1 = require("../../../../shared/utils/matriz");
let RiskDataRepository = class RiskDataRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(upsertRiskDataDto) {
        const level = await this.addLevel(upsertRiskDataDto);
        if (level)
            upsertRiskDataDto.level = level;
        const riskFactorData = await this.upsertPrisma(upsertRiskDataDto);
        return new riskData_entity_1.RiskFactorDataEntity(riskFactorData);
    }
    async upsertConnectMany(upsertManyRiskDataDto) {
        const homogeneousGroupIds = upsertManyRiskDataDto.homogeneousGroupIds;
        if (homogeneousGroupIds) {
            delete upsertManyRiskDataDto.homogeneousGroupIds;
            delete upsertManyRiskDataDto.hierarchyIds;
            delete upsertManyRiskDataDto.riskIds;
            const level = await this.addLevel(upsertManyRiskDataDto);
            if (level)
                upsertManyRiskDataDto.level = level;
            const data = await Promise.all(homogeneousGroupIds.map(async (homogeneousGroupId) => this.upsertConnectPrisma(Object.assign({ homogeneousGroupId }, upsertManyRiskDataDto))));
            return data.map((riskFactorData) => new riskData_entity_1.RiskFactorDataEntity(riskFactorData));
        }
        return [];
    }
    async upsertMany(upsertManyRiskDataDto) {
        const homogeneousGroupIds = upsertManyRiskDataDto.homogeneousGroupIds;
        if (homogeneousGroupIds) {
            delete upsertManyRiskDataDto.homogeneousGroupIds;
            delete upsertManyRiskDataDto.hierarchyIds;
            delete upsertManyRiskDataDto.riskIds;
            const level = await this.addLevel(upsertManyRiskDataDto);
            if (level)
                upsertManyRiskDataDto.level = level;
            const data = await Promise.all(homogeneousGroupIds.map(async (homogeneousGroupId) => this.upsertPrisma(Object.assign({ homogeneousGroupId }, upsertManyRiskDataDto))));
            return data.map((riskFactorData) => new riskData_entity_1.RiskFactorDataEntity(riskFactorData));
        }
        return [];
    }
    async findAllByGroup(riskFactorGroupDataId, companyId) {
        const riskFactorData = await this.prisma.riskFactorData.findMany({
            where: { riskFactorGroupDataId, companyId },
            include: {
                adms: true,
                recs: true,
                generateSources: true,
                hierarchy: true,
                riskFactor: true,
                epiToRiskFactorData: { include: { epi: true } },
                engsToRiskFactorData: { include: { recMed: true } },
                examsToRiskFactorData: { include: { exam: true } },
                homogeneousGroup: {
                    include: {
                        hierarchyOnHomogeneous: { include: { hierarchy: true } },
                    },
                },
            },
        });
        return riskFactorData.map((data) => {
            const riskData = Object.assign({}, data);
            if (data.homogeneousGroup && data.homogeneousGroup.hierarchyOnHomogeneous)
                riskData.homogeneousGroup.hierarchies = data.homogeneousGroup.hierarchyOnHomogeneous.map((homo) => (Object.assign(Object.assign({}, homo.hierarchy), { workspaceId: homo.workspaceId })));
            return new riskData_entity_1.RiskFactorDataEntity(riskData);
        });
    }
    async findAllByGroupAndRisk(riskFactorGroupDataId, riskId, companyId) {
        const riskFactorData = (await this.prisma.riskFactorData.findMany({
            where: { riskFactorGroupDataId, companyId, riskId },
            include: {
                adms: true,
                recs: true,
                generateSources: true,
                epiToRiskFactorData: { include: { epi: true } },
                engsToRiskFactorData: { include: { recMed: true } },
                examsToRiskFactorData: { include: { exam: true } },
            },
        }));
        return riskFactorData.map((data) => new riskData_entity_1.RiskFactorDataEntity(data));
    }
    async findAllActionPlan(riskFactorGroupDataId, workspaceId, companyId, query, pagination) {
        const where = {
            AND: [
                {
                    riskFactorGroupDataId,
                    companyId,
                    recs: { some: { recName: { contains: '' } } },
                    homogeneousGroup: {
                        hierarchyOnHomogeneous: {
                            some: {
                                OR: [
                                    { workspaceId: workspaceId },
                                    {
                                        hierarchy: {
                                            workspaces: {
                                                some: { id: workspaceId },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            ],
        };
        const response = await this.prisma.$transaction([
            this.prisma.riskFactorData.count({
                where,
            }),
            this.prisma.riskFactorData.findMany({
                where,
                orderBy: { level: 'desc' },
                take: pagination.take || 20,
                skip: pagination.skip || 0,
                include: {
                    adms: true,
                    recs: true,
                    generateSources: true,
                    riskFactor: true,
                    dataRecs: { include: { comments: true } },
                    epiToRiskFactorData: { include: { epi: true } },
                    engsToRiskFactorData: { include: { recMed: true } },
                    examsToRiskFactorData: { include: { exam: true } },
                    homogeneousGroup: {
                        include: { characterization: true, environment: true },
                    },
                },
            }),
        ]);
        const riskData = await Promise.all(response[1].map(async (data) => {
            if (data.homogeneousGroup && data.homogeneousGroup.type === 'HIERARCHY') {
                const hierarchy = await this.prisma.hierarchy.findUnique({
                    where: { id: data.homogeneousGroup.id },
                });
                data.homogeneousGroup.hierarchy = hierarchy;
            }
            if (data.homogeneousGroup.characterization && (0, CharacterizationRepository_1.isEnvironment)(data.homogeneousGroup.characterization.type)) {
                data.homogeneousGroup.environment = data.homogeneousGroup.characterization;
                data.homogeneousGroup.characterization = null;
            }
            return new riskData_entity_1.RiskFactorDataEntity(data);
        }));
        return {
            data: riskData,
            count: response[0],
        };
    }
    async findAllByHomogeneousGroupId(companyId, riskFactorGroupDataId, homogeneousGroupId) {
        const riskFactorData = (await this.prisma.riskFactorData.findMany({
            where: { riskFactorGroupDataId, companyId, homogeneousGroupId },
            include: {
                adms: true,
                recs: true,
                epiToRiskFactorData: { include: { epi: true } },
                engsToRiskFactorData: { include: { recMed: true } },
                examsToRiskFactorData: { include: { exam: true } },
                generateSources: true,
            },
        }));
        return riskFactorData.map((data) => new riskData_entity_1.RiskFactorDataEntity(data));
    }
    async findAllByHierarchyId(companyId, hierarchyId, options = {}) {
        const riskFactorData = (await this.prisma.riskFactorData.findMany(Object.assign(Object.assign({}, options), { where: Object.assign({ companyId, homogeneousGroup: { hierarchyOnHomogeneous: { some: { hierarchyId } } } }, options === null || options === void 0 ? void 0 : options.where), include: Object.assign({ adms: {
                    select: {
                        medName: true,
                        medType: true,
                        id: true,
                        riskId: true,
                    },
                }, recs: {
                    select: {
                        recName: true,
                        recType: true,
                        id: true,
                        riskId: true,
                    },
                }, generateSources: true, epiToRiskFactorData: { include: { epi: true } }, engsToRiskFactorData: {
                    include: {
                        recMed: {
                            select: {
                                medName: true,
                                medType: true,
                                id: true,
                                riskId: true,
                            },
                        },
                    },
                }, examsToRiskFactorData: {
                    include: {
                        exam: { select: { name: true, status: true } },
                    },
                } }, options.include) })));
        return riskFactorData.map((data) => new riskData_entity_1.RiskFactorDataEntity(data));
    }
    async findNude(options = {}) {
        const response = await this.prisma.riskFactorData.findMany(Object.assign({}, options));
        return response.map((exam) => new riskData_entity_1.RiskFactorDataEntity(exam));
    }
    async deleteById(id) {
        const riskFactorData = await this.prisma.riskFactorData.delete({
            where: { id },
        });
        return new riskData_entity_1.RiskFactorDataEntity(riskFactorData);
    }
    async deleteByIds(ids) {
        const riskFactorData = await this.prisma.riskFactorData.deleteMany({
            where: { id: { in: ids } },
        });
        return riskFactorData;
    }
    async deleteByIdsAndCompany(ids, companyId) {
        const riskFactorData = await this.prisma.riskFactorData.deleteMany({
            where: { id: { in: ids }, companyId },
        });
        return riskFactorData;
    }
    async deleteByHomoAndRisk(homogeneousGroupIds, riskIds, groupId) {
        const riskFactorData = await this.prisma.riskFactorData.deleteMany({
            where: {
                AND: [{ homogeneousGroupId: { in: homogeneousGroupIds } }, { riskId: { in: riskIds } }, { riskFactorGroupDataId: groupId }],
            },
        });
        return riskFactorData;
    }
    async upsertPrisma(_a) {
        var _b, _c, _d;
        var { recs, adms, engs, epis, exams, generateSources, companyId, id } = _a, createDto = __rest(_a, ["recs", "adms", "engs", "epis", "exams", "generateSources", "companyId", "id"]);
        const isCreation = !id;
        if (isCreation) {
            const foundRiskData = await this.prisma.riskFactorData.findMany({
                where: {
                    riskFactorGroupDataId: createDto.riskFactorGroupDataId,
                    riskId: createDto.riskId,
                    homogeneousGroupId: createDto.homogeneousGroupId,
                },
                orderBy: { endDate: 'desc' },
            });
            if (foundRiskData.length !== 0) {
                const findEndDateNull = foundRiskData.find((riskData) => riskData.endDate == null);
                if (findEndDateNull)
                    id = findEndDateNull.id;
            }
        }
        const riskData = (await this.prisma.riskFactorData.upsert({
            create: Object.assign(Object.assign({}, createDto), { companyId, generateSources: generateSources
                    ? {
                        connect: generateSources.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, recs: recs
                    ? {
                        connect: recs.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, adms: adms
                    ? {
                        connect: adms.map((id) => ({
                            id,
                        })),
                    }
                    : undefined }),
            update: Object.assign(Object.assign({}, createDto), { companyId, recs: recs
                    ? {
                        set: recs.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, adms: adms
                    ? {
                        set: adms.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, generateSources: generateSources
                    ? {
                        set: generateSources.map((id) => ({
                            id,
                        })),
                    }
                    : undefined }),
            where: {
                id: id || 'no-id',
            },
            include: {
                adms: true,
                recs: true,
                generateSources: true,
                epiToRiskFactorData: { include: { epi: true } },
                engsToRiskFactorData: !engs ? { include: { recMed: true } } : undefined,
                examsToRiskFactorData: { include: { exam: true } },
            },
        }));
        if (epis) {
            if ((_b = riskData.epiToRiskFactorData) === null || _b === void 0 ? void 0 : _b.length) {
                await this.prisma.epiToRiskFactorData.deleteMany({
                    where: {
                        riskFactorDataId: riskData.id,
                        epiId: {
                            in: (0, m2mFilterIds_1.m2mGetDeletedIds)(riskData.epiToRiskFactorData, epis, 'epiId'),
                        },
                    },
                });
            }
            riskData.epiToRiskFactorData = await this.setEpis(epis.map((epi) => (Object.assign(Object.assign({}, epi), { riskFactorDataId: riskData.id }))));
        }
        if (engs) {
            if ((_c = riskData.engsToRiskFactorData) === null || _c === void 0 ? void 0 : _c.length) {
                await this.prisma.engsToRiskFactorData.deleteMany({
                    where: {
                        riskFactorDataId: riskData.id,
                        recMedId: {
                            in: (0, m2mFilterIds_1.m2mGetDeletedIds)(riskData.engsToRiskFactorData, engs, 'recMedId'),
                        },
                    },
                });
            }
            riskData.engsToRiskFactorData = await this.setEngs(engs.map((eng) => (Object.assign(Object.assign({}, eng), { riskFactorDataId: riskData.id }))));
        }
        if (exams) {
            if ((_d = riskData.examsToRiskFactorData) === null || _d === void 0 ? void 0 : _d.length) {
                await this.prisma.examToRiskData.deleteMany({
                    where: {
                        riskFactorDataId: riskData.id,
                        examId: {
                            in: (0, m2mFilterIds_1.m2mGetDeletedIds)(riskData.examsToRiskFactorData, exams, 'examId'),
                        },
                    },
                });
            }
            riskData.examsToRiskFactorData = await this.setExams(exams.map((exam) => (Object.assign(Object.assign({}, exam), { riskFactorDataId: riskData.id }))));
        }
        return riskData;
    }
    async upsertConnectPrisma(_a) {
        var { recs, adms, engs, epis, exams, generateSources, companyId, id } = _a, createDto = __rest(_a, ["recs", "adms", "engs", "epis", "exams", "generateSources", "companyId", "id"]);
        const foundRiskData = await this.prisma.riskFactorData.findMany({
            where: {
                riskFactorGroupDataId: createDto.riskFactorGroupDataId,
                riskId: createDto.riskId,
                homogeneousGroupId: createDto.homogeneousGroupId,
            },
            orderBy: { endDate: 'desc' },
        });
        if (foundRiskData.length !== 0) {
            const findEndDateNull = foundRiskData.find((riskData) => riskData.endDate == null);
            if (findEndDateNull)
                id = findEndDateNull.id;
        }
        const riskData = (await this.prisma.riskFactorData.upsert({
            create: Object.assign(Object.assign({}, createDto), { companyId, generateSources: generateSources
                    ? {
                        connect: generateSources.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, recs: recs
                    ? {
                        connect: recs.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, adms: adms
                    ? {
                        connect: adms.map((id) => ({
                            id,
                        })),
                    }
                    : undefined }),
            update: Object.assign(Object.assign({}, createDto), { companyId, recs: recs
                    ? {
                        connect: recs.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, adms: adms
                    ? {
                        connect: adms.map((id) => ({
                            id,
                        })),
                    }
                    : undefined, generateSources: generateSources
                    ? {
                        connect: generateSources.map((id) => ({
                            id,
                        })),
                    }
                    : undefined }),
            where: {
                id: id || 'no-id',
            },
            include: {
                adms: true,
                recs: true,
                generateSources: true,
                epiToRiskFactorData: !epis ? { include: { epi: true } } : undefined,
                engsToRiskFactorData: !engs ? { include: { recMed: true } } : undefined,
                examsToRiskFactorData: !exams ? { include: { exam: true } } : undefined,
            },
        }));
        if (epis)
            riskData.epiToRiskFactorData = await this.setEpis(epis.map((epi) => (Object.assign(Object.assign({}, epi), { riskFactorDataId: riskData.id }))));
        if (engs)
            riskData.engsToRiskFactorData = await this.setEngs(engs.map((eng) => (Object.assign(Object.assign({}, eng), { riskFactorDataId: riskData.id }))));
        if (exams)
            riskData.examsToRiskFactorData = await this.setExams(exams.map((exam) => (Object.assign(Object.assign({}, exam), { riskFactorDataId: riskData.id }))));
        return riskData;
    }
    async setEpis(epis) {
        if (epis.length === 0)
            return [];
        const data = await this.prisma.$transaction(epis.map((_a) => {
            var { riskFactorDataId, epiId } = _a, epiRelation = __rest(_a, ["riskFactorDataId", "epiId"]);
            return this.prisma.epiToRiskFactorData.upsert({
                create: Object.assign({ riskFactorDataId, epiId }, epiRelation),
                update: Object.assign({ riskFactorDataId, epiId }, epiRelation),
                where: {
                    riskFactorDataId_epiId: { riskFactorDataId, epiId },
                },
                include: { epi: true },
            });
        }));
        return data;
    }
    async setExams(exams) {
        if (exams.length === 0)
            return [];
        const data = await this.prisma.$transaction(exams.map((_a) => {
            var { riskFactorDataId, examId } = _a, examRelation = __rest(_a, ["riskFactorDataId", "examId"]);
            return this.prisma.examToRiskData.upsert({
                create: Object.assign({ riskFactorDataId, examId }, examRelation),
                update: Object.assign({ riskFactorDataId, examId }, examRelation),
                where: {
                    examId_riskFactorDataId: { riskFactorDataId, examId },
                },
                include: { exam: true },
            });
        }));
        return data;
    }
    async setEngs(engs) {
        if (engs.length === 0)
            return [];
        const data = await this.prisma.$transaction(engs.map((_a) => {
            var { riskFactorDataId, recMedId } = _a, rest = __rest(_a, ["riskFactorDataId", "recMedId"]);
            return this.prisma.engsToRiskFactorData.upsert({
                create: Object.assign({ riskFactorDataId, recMedId }, rest),
                update: Object.assign({ riskFactorDataId, recMedId }, rest),
                where: {
                    riskFactorDataId_recMedId: { riskFactorDataId, recMedId },
                },
                include: { recMed: true },
            });
        }));
        return data;
    }
    async addLevel({ riskId, probability, json }) {
        let level = 0;
        let realProbability = probability;
        if (json) {
            const riskData = new riskData_entity_1.RiskFactorDataEntity({ json });
            if (riskData.probability)
                realProbability = riskData.probability;
        }
        if (realProbability && riskId) {
            const risk = await this.prisma.riskFactors.findUnique({
                where: {
                    id: riskId,
                },
            });
            if (risk && risk.severity) {
                const matriz = (0, matriz_1.getMatrizRisk)(risk.severity, realProbability);
                level = matriz.level;
            }
        }
        return level;
    }
};
RiskDataRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RiskDataRepository);
exports.RiskDataRepository = RiskDataRepository;
//# sourceMappingURL=RiskDataRepository.js.map