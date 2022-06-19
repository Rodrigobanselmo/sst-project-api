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
exports.RiskRepository = void 0;
const common_1 = require("@nestjs/common");
const removeDuplicate_1 = require("../../../../shared/utils/removeDuplicate");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const risk_entity_1 = require("../../entities/risk.entity");
let RiskRepository = class RiskRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a, system) {
        var { recMed, generateSource } = _a, createRiskDto = __rest(_a, ["recMed", "generateSource"]);
        const risk = await this.prisma.riskFactors.create({
            data: Object.assign(Object.assign({}, createRiskDto), { system, recMed: {
                    createMany: {
                        data: recMed
                            ? recMed.map((_a) => {
                                var rm = __rest(_a, []);
                                return (Object.assign({ system, companyId: createRiskDto.companyId }, rm));
                            })
                            : [],
                        skipDuplicates: true,
                    },
                }, generateSource: {
                    createMany: {
                        data: generateSource
                            ? generateSource.map((_a) => {
                                var gs = __rest(_a, []);
                                return (Object.assign({ system, companyId: createRiskDto.companyId }, gs));
                            })
                            : [],
                        skipDuplicates: true,
                    },
                } }),
            include: { recMed: true, generateSource: true },
        });
        return new risk_entity_1.RiskFactorsEntity(risk);
    }
    async update(_a, system, companyId) {
        var { recMed, generateSource, id } = _a, createRiskDto = __rest(_a, ["recMed", "generateSource", "id"]);
        const risk = await this.prisma.riskFactors.update({
            data: Object.assign({ recMed: {
                    upsert: !recMed
                        ? []
                        : recMed.map((_a) => {
                            var { id } = _a, rm = __rest(_a, ["id"]);
                            return {
                                create: Object.assign({ system, companyId }, rm),
                                update: Object.assign({ system }, rm),
                                where: { id: id || 'no-id' },
                            };
                        }),
                }, generateSource: {
                    upsert: !generateSource
                        ? []
                        : generateSource.map((_a) => {
                            var { id } = _a, gs = __rest(_a, ["id"]);
                            return {
                                create: Object.assign({ system, companyId }, gs),
                                update: Object.assign({ system }, gs),
                                where: { id: id || 'no-id' },
                            };
                        }),
                } }, createRiskDto),
            where: { id_companyId: { companyId, id: id || 'no-id' } },
            include: { recMed: true, generateSource: true },
        });
        return new risk_entity_1.RiskFactorsEntity(risk);
    }
    async upsert(_a, system, companyId) {
        var { companyId: _, id, recMed, generateSource } = _a, upsertRiskDto = __rest(_a, ["companyId", "id", "recMed", "generateSource"]);
        const risk = await this.prisma.riskFactors.upsert({
            create: Object.assign(Object.assign({}, upsertRiskDto), { system,
                companyId, recMed: {
                    createMany: {
                        data: !recMed
                            ? []
                            : recMed.map((_a) => {
                                var { id } = _a, rm = __rest(_a, ["id"]);
                                return (Object.assign({ system }, rm));
                            }),
                        skipDuplicates: true,
                    },
                }, generateSource: {
                    createMany: {
                        data: !generateSource
                            ? []
                            : generateSource.map((_a) => {
                                var { id } = _a, gs = __rest(_a, ["id"]);
                                return (Object.assign({ system }, gs));
                            }),
                        skipDuplicates: true,
                    },
                } }),
            update: Object.assign(Object.assign({}, upsertRiskDto), { system, recMed: {
                    upsert: !recMed
                        ? []
                        : recMed.map((_a) => {
                            var { id } = _a, rm = __rest(_a, ["id"]);
                            return {
                                create: Object.assign({ system }, rm),
                                update: Object.assign({ system }, rm),
                                where: { id: id || 'no-id' },
                            };
                        }),
                }, generateSource: {
                    upsert: !generateSource
                        ? []
                        : generateSource.map((_a) => {
                            var { id, companyId, recMeds: _ } = _a, gs = __rest(_a, ["id", "companyId", "recMeds"]);
                            return {
                                create: Object.assign({ system, companyId }, gs),
                                update: Object.assign({ system }, gs),
                                where: { id: id || 'no-id' },
                            };
                        }),
                } }),
            where: { id_companyId: { companyId, id: id || 'no-id' } },
            include: { recMed: true, generateSource: true },
        });
        return new risk_entity_1.RiskFactorsEntity(risk);
    }
    async upsertMany(upsertRiskDtoMany, system, companyId) {
        const data = await this.prisma.$transaction(upsertRiskDtoMany.map((_a) => {
            var { companyId: _, id, recMed, generateSource } = _a, upsertRiskDto = __rest(_a, ["companyId", "id", "recMed", "generateSource"]);
            return this.prisma.riskFactors.upsert({
                create: Object.assign(Object.assign({}, upsertRiskDto), { system,
                    companyId, recMed: {
                        createMany: {
                            data: !recMed
                                ? []
                                : recMed.map((_a) => {
                                    var { id } = _a, rm = __rest(_a, ["id"]);
                                    return (Object.assign({ system }, rm));
                                }),
                            skipDuplicates: true,
                        },
                    }, generateSource: {
                        createMany: {
                            data: !generateSource
                                ? []
                                : generateSource.map((_a) => {
                                    var { id } = _a, rm = __rest(_a, ["id"]);
                                    return (Object.assign({ system }, rm));
                                }),
                            skipDuplicates: true,
                        },
                    } }),
                update: Object.assign(Object.assign({}, upsertRiskDto), { system, recMed: {
                        upsert: !recMed
                            ? []
                            : recMed.map((_a) => {
                                var { id } = _a, rm = __rest(_a, ["id"]);
                                return {
                                    create: Object.assign({ system }, rm),
                                    update: Object.assign({ system }, rm),
                                    where: { id: id || 'no-id' },
                                };
                            }),
                    }, generateSource: {
                        upsert: !generateSource
                            ? []
                            : generateSource.map((_a) => {
                                var { id, recMeds: _ } = _a, gs = __rest(_a, ["id", "recMeds"]);
                                return {
                                    create: Object.assign({ system }, gs),
                                    update: Object.assign({ system }, gs),
                                    where: { id: id || 'no-id' },
                                };
                            }),
                    } }),
                where: { id_companyId: { companyId, id: id || 'no-id' } },
                include: { recMed: true, generateSource: true },
            });
        }));
        return data.map((risk) => new risk_entity_1.RiskFactorsEntity(risk));
    }
    async findById(id, companyId, options) {
        const include = options.include || {};
        const risk = await this.prisma.riskFactors.findUnique({
            where: { id_companyId: { id, companyId } },
            include: {
                company: !!include.company,
                recMed: !!include.recMed,
                generateSource: !!include.generateSource,
            },
        });
        return new risk_entity_1.RiskFactorsEntity(risk);
    }
    async findAllByCompanyId(companyId, options) {
        const where = options.where || {};
        const include = options.include || {};
        const risks = await this.prisma.riskFactors.findMany({
            where: Object.assign({ companyId }, where),
            include: {
                company: !!include.company,
                recMed: !!include.recMed,
                generateSource: !!include.generateSource,
            },
        });
        return risks.map((risk) => new risk_entity_1.RiskFactorsEntity(risk));
    }
    async findAllAvailable(companyId, userCompanyId, _a = {}) {
        var { representAll } = _a, options = __rest(_a, ["representAll"]);
        const include = options.include || {};
        const rall = typeof representAll === 'boolean' ? { representAll: representAll } : {};
        const companyIds = [userCompanyId, companyId];
        const parentCompaniesIds = await this.prisma.contract.findMany({
            where: {
                receivingServiceCompanyId: { equals: userCompanyId },
            },
            select: { applyingServiceCompanyId: true },
        });
        parentCompaniesIds.map((companyId) => companyIds.push(companyId.applyingServiceCompanyId));
        const risks = await this.prisma.riskFactors.findMany(Object.assign({ where: {
                AND: [
                    {
                        OR: [
                            ...(0, removeDuplicate_1.removeDuplicate)(companyIds, { simpleCompare: true }).map((c) => ({ companyId: c })),
                            { system: true },
                        ],
                    },
                    rall,
                ],
                deleted_at: null,
            } }, options));
        return risks.map((risk) => new risk_entity_1.RiskFactorsEntity(risk));
    }
    async DeleteByIdSoft(id) {
        const riskFactors = await this.prisma.riskFactors.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return new risk_entity_1.RiskFactorsEntity(riskFactors);
    }
    async DeleteByCompanyAndIdSoft(id, companyId) {
        const riskFactors = await this.prisma.riskFactors.update({
            where: { id_companyId: { id, companyId } },
            data: { deleted_at: new Date() },
        });
        return new risk_entity_1.RiskFactorsEntity(riskFactors);
    }
};
RiskRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RiskRepository);
exports.RiskRepository = RiskRepository;
//# sourceMappingURL=RiskRepository.js.map