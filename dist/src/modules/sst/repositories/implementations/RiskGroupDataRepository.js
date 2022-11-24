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
exports.RiskGroupDataRepository = void 0;
const CharacterizationRepository_1 = require("../../../company/repositories/implementations/CharacterizationRepository");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const riskGroupData_entity_1 = require("../../entities/riskGroupData.entity");
const m2mFilterIds_1 = require("./../../../../shared/utils/m2mFilterIds");
let RiskGroupDataRepository = class RiskGroupDataRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var _b, _c;
        var { companyId, id, users, professionals } = _a, createDto = __rest(_a, ["companyId", "id", "users", "professionals"]);
        const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.upsert({
            create: Object.assign(Object.assign({}, createDto), { companyId }),
            update: Object.assign(Object.assign({}, createDto), { companyId }),
            where: { id_companyId: { companyId, id: id || 'not-found' } },
            include: {
                usersSignatures: !!users,
                professionalsSignatures: !!professionals,
            },
        });
        if (users) {
            if ((_b = riskFactorGroupDataEntity.usersSignatures) === null || _b === void 0 ? void 0 : _b.length) {
                await this.prisma.riskFactorGroupDataToUser.deleteMany({
                    where: {
                        userId: {
                            in: (0, m2mFilterIds_1.m2mGetDeletedIds)(riskFactorGroupDataEntity.usersSignatures, users, 'userId'),
                        },
                        riskFactorGroupDataId: riskFactorGroupDataEntity.id,
                    },
                });
            }
            riskFactorGroupDataEntity.usersSignatures = await this.setUsersSignatures(users.map((user) => (Object.assign(Object.assign({}, user), { riskFactorGroupDataId: riskFactorGroupDataEntity.id }))));
        }
        if (professionals) {
            if ((_c = riskFactorGroupDataEntity.professionalsSignatures) === null || _c === void 0 ? void 0 : _c.length) {
                await this.prisma.riskFactorGroupDataToProfessional.deleteMany({
                    where: {
                        professionalId: {
                            in: (0, m2mFilterIds_1.m2mGetDeletedIds)(riskFactorGroupDataEntity.professionalsSignatures, professionals, 'professionalId'),
                        },
                        riskFactorGroupDataId: riskFactorGroupDataEntity.id,
                    },
                });
            }
            riskFactorGroupDataEntity.professionalsSignatures = await this.setProfessionalsSignatures(professionals.map((user) => (Object.assign(Object.assign({}, user), { riskFactorGroupDataId: riskFactorGroupDataEntity.id }))));
        }
        return new riskGroupData_entity_1.RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
    }
    async findAllByCompany(companyId) {
        const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.findMany({
            where: { companyId },
        });
        return riskFactorGroupDataEntity.map((data) => new riskGroupData_entity_1.RiskFactorGroupDataEntity(data));
    }
    async findById(id, companyId, options = {}) {
        const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.findUnique(Object.assign({ where: { id_companyId: { id, companyId } } }, options));
        return new riskGroupData_entity_1.RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
    }
    async findAllDataById(id, workspaceId, companyId, options = {}) {
        const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.findUnique({
            where: { id_companyId: { id, companyId } },
            include: {
                company: true,
                professionalsSignatures: {
                    include: { professional: { include: { professional: true } } },
                },
                usersSignatures: {
                    include: {
                        user: {
                            include: { professional: { include: { councils: true } } },
                        },
                    },
                },
                data: {
                    where: {
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
                    include: {
                        adms: true,
                        recs: true,
                        generateSources: true,
                        epiToRiskFactorData: { include: { epi: true } },
                        engsToRiskFactorData: { include: { recMed: true } },
                        riskFactor: {
                            include: {
                                docInfo: {
                                    where: {
                                        OR: [
                                            { companyId },
                                            {
                                                company: {
                                                    applyingServiceContracts: {
                                                        some: { receivingServiceCompanyId: companyId },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        dataRecs: true,
                        hierarchy: {
                            include: { employees: { select: { _count: true } } },
                        },
                        homogeneousGroup: {
                            include: { characterization: true, environment: true },
                        },
                    },
                },
            },
        });
        riskFactorGroupDataEntity.data.map((data, index) => {
            if (data.homogeneousGroup.characterization && (0, CharacterizationRepository_1.isEnvironment)(data.homogeneousGroup.characterization.type)) {
                riskFactorGroupDataEntity.data[index].homogeneousGroup.environment = data.homogeneousGroup.characterization;
                riskFactorGroupDataEntity.data[index].homogeneousGroup.characterization = data.homogeneousGroup.characterization = null;
            }
        });
        return new riskGroupData_entity_1.RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
    }
    async setUsersSignatures(usersSignatures) {
        if (usersSignatures.length === 0)
            return [];
        const data = await this.prisma.$transaction(usersSignatures.map((_a) => {
            var { user, userId, riskFactorGroupDataId } = _a, rest = __rest(_a, ["user", "userId", "riskFactorGroupDataId"]);
            return this.prisma.riskFactorGroupDataToUser.upsert({
                create: Object.assign({ riskFactorGroupDataId, userId }, rest),
                update: Object.assign({ riskFactorGroupDataId, userId }, rest),
                where: {
                    userId_riskFactorGroupDataId: { riskFactorGroupDataId, userId },
                },
                include: { user: true },
            });
        }));
        return data;
    }
    async setProfessionalsSignatures(professionalsSignatures) {
        if (professionalsSignatures.length === 0)
            return [];
        const data = await this.prisma.$transaction(professionalsSignatures.map((_a) => {
            var { professional, professionalId, riskFactorGroupDataId } = _a, rest = __rest(_a, ["professional", "professionalId", "riskFactorGroupDataId"]);
            return this.prisma.riskFactorGroupDataToProfessional.upsert({
                create: Object.assign({ riskFactorGroupDataId, professionalId }, rest),
                update: Object.assign({ riskFactorGroupDataId, professionalId }, rest),
                where: {
                    riskFactorGroupDataId_professionalId: {
                        riskFactorGroupDataId,
                        professionalId,
                    },
                },
                include: { professional: true },
            });
        }));
        return data;
    }
};
RiskGroupDataRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RiskGroupDataRepository);
exports.RiskGroupDataRepository = RiskGroupDataRepository;
//# sourceMappingURL=RiskGroupDataRepository.js.map