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
const common_1 = require("@nestjs/common");
const removeDuplicate_1 = require("../../../../shared/utils/removeDuplicate");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const riskData_entity_1 = require("../../entities/riskData.entity");
let RiskDataRepository = class RiskDataRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var { recs, adms, engs, epis, generateSources, companyId, id } = _a, createDto = __rest(_a, ["recs", "adms", "engs", "epis", "generateSources", "companyId", "id"]);
        const riskFactorData = await this.prisma.riskFactorData.upsert({
            create: Object.assign(Object.assign({}, createDto), { companyId, epis: epis
                    ? {
                        connect: epis.map((id) => ({ id })),
                    }
                    : undefined, generateSources: generateSources
                    ? {
                        connect: generateSources.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, recs: recs
                    ? {
                        connect: recs.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, adms: adms
                    ? {
                        connect: adms.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, engs: engs
                    ? {
                        connect: engs.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined }),
            update: Object.assign(Object.assign({}, createDto), { companyId, recs: recs
                    ? {
                        set: recs.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, adms: adms
                    ? {
                        set: adms.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, engs: engs
                    ? {
                        set: engs.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, generateSources: generateSources
                    ? {
                        set: generateSources.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, epis: epis
                    ? {
                        set: epis.map((id) => ({ id })),
                    }
                    : undefined }),
            where: { id_companyId: { companyId, id: id || 'not-found' } },
            include: {
                adms: true,
                recs: true,
                engs: true,
                generateSources: true,
                epis: true,
            },
        });
        return new riskData_entity_1.RiskFactorDataEntity(riskFactorData);
    }
    async findAllByGroup(riskFactorGroupDataId, companyId) {
        const riskFactorData = await this.prisma.riskFactorData.findMany({
            where: { riskFactorGroupDataId, companyId },
            include: {
                adms: true,
                recs: true,
                engs: true,
                generateSources: true,
                epis: true,
                hierarchy: true,
                riskFactor: true,
                homogeneousGroup: { include: { hierarchies: true } },
            },
        });
        return riskFactorData.map((data) => new riskData_entity_1.RiskFactorDataEntity(data));
    }
    async findAllByGroupAndRisk(riskFactorGroupDataId, riskId, companyId) {
        const riskFactorData = await this.prisma.riskFactorData.findMany({
            where: { riskFactorGroupDataId, companyId, riskId },
            include: {
                adms: true,
                recs: true,
                engs: true,
                generateSources: true,
                epis: true,
            },
        });
        return riskFactorData.map((data) => new riskData_entity_1.RiskFactorDataEntity(data));
    }
};
RiskDataRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RiskDataRepository);
exports.RiskDataRepository = RiskDataRepository;
//# sourceMappingURL=RiskDataRepository.js.map