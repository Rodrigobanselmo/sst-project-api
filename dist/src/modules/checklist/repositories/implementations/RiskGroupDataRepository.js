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
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const riskGroupData_entity_1 = require("../../entities/riskGroupData.entity");
let RiskGroupDataRepository = class RiskGroupDataRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var { companyId, id } = _a, createDto = __rest(_a, ["companyId", "id"]);
        const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.upsert({
            create: Object.assign(Object.assign({}, createDto), { companyId }),
            update: Object.assign(Object.assign({}, createDto), { companyId }),
            where: { id_companyId: { companyId, id: id || 'not-found' } },
        });
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
    async findAllDataById(id, companyId, options) {
        const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.findUnique({
            where: { id_companyId: { id, companyId } },
            include: {
                data: {
                    include: {
                        adms: true,
                        recs: true,
                        engs: true,
                        generateSources: true,
                        epis: true,
                        riskFactor: true,
                        hierarchy: (options === null || options === void 0 ? void 0 : options.includeEmployees)
                            ? { include: { employees: true } }
                            : true,
                        homogeneousGroup: {
                            include: {
                                hierarchies: (options === null || options === void 0 ? void 0 : options.includeEmployees)
                                    ? { include: { employees: true } }
                                    : true,
                            },
                        },
                    },
                },
                company: true,
            },
        });
        return new riskGroupData_entity_1.RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
    }
};
RiskGroupDataRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RiskGroupDataRepository);
exports.RiskGroupDataRepository = RiskGroupDataRepository;
//# sourceMappingURL=RiskGroupDataRepository.js.map