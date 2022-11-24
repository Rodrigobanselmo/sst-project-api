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
exports.EnvironmentRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const environment_entity_1 = require("../../entities/environment.entity");
const hierarchy_entity_1 = require("../../entities/hierarchy.entity");
const risk_entity_1 = require("../../../sst/entities/risk.entity");
const riskData_entity_1 = require("../../../sst/entities/riskData.entity");
let EnvironmentRepository = class EnvironmentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var { id, companyId, workspaceId, hierarchyIds = [] } = _a, characterizationDto = __rest(_a, ["id", "companyId", "workspaceId", "hierarchyIds"]);
        const newId = (0, uuid_1.v4)();
        const homogeneousGroup = await this.prisma.homogeneousGroup.upsert({
            where: { id: id || 'no-id' },
            create: {
                id: newId,
                name: newId,
                description: characterizationDto.name + '(//)' + characterizationDto.type,
                companyId: companyId,
                type: client_1.HomoTypeEnum.ENVIRONMENT,
            },
            update: {
                description: characterizationDto.name + '(//)' + characterizationDto.type,
            },
        });
        await this.prisma.hierarchyOnHomogeneous.deleteMany({
            where: { homogeneousGroupId: homogeneousGroup.id },
        });
        const characterization = (await this.prisma.companyCharacterization.upsert({
            where: {
                workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
            },
            create: Object.assign(Object.assign({}, characterizationDto), { id: newId, companyId,
                workspaceId, name: characterizationDto.name, type: characterizationDto.type }),
            update: Object.assign({}, characterizationDto),
        }));
        return new environment_entity_1.EnvironmentEntity(characterization);
    }
    async findAll(companyId, workspaceId, options) {
        const characterization = (await this.prisma.companyCharacterization.findMany(Object.assign({ where: {
                workspaceId,
                companyId,
                type: {
                    in: [client_1.CharacterizationTypeEnum.ADMINISTRATIVE, client_1.CharacterizationTypeEnum.GENERAL, client_1.CharacterizationTypeEnum.OPERATION, client_1.CharacterizationTypeEnum.SUPPORT],
                },
            } }, options)));
        return [...characterization.map((env) => new environment_entity_1.EnvironmentEntity(env))];
    }
    async findById(id, options = {}) {
        const characterization = (await this.prisma.companyCharacterization.findUnique({
            where: { id },
            include: Object.assign({ photos: true }, options.include),
        }));
        const hierarchies = await this.prisma.hierarchy.findMany({
            where: {
                hierarchyOnHomogeneous: {
                    some: { homogeneousGroupId: characterization.id },
                },
            },
        });
        if (options.getRiskData) {
            const riskData = await this.prisma.riskFactorData.findMany({
                where: {
                    homogeneousGroupId: id,
                },
                include: { riskFactor: true },
            });
            characterization.riskData = riskData.map((_a) => {
                var { riskFactor } = _a, risk = __rest(_a, ["riskFactor"]);
                return new riskData_entity_1.RiskFactorDataEntity(Object.assign(Object.assign({}, risk), (riskFactor ? { riskFactor: new risk_entity_1.RiskFactorsEntity(riskFactor) } : {})));
            });
        }
        characterization.hierarchies = hierarchies.map((hierarchy) => new hierarchy_entity_1.HierarchyEntity(hierarchy));
        return new environment_entity_1.EnvironmentEntity(characterization);
    }
    async delete(id, companyId, workspaceId) {
        const characterization = await this.prisma.companyCharacterization.delete({
            where: {
                workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
            },
        });
        return new environment_entity_1.EnvironmentEntity(characterization);
    }
};
EnvironmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnvironmentRepository);
exports.EnvironmentRepository = EnvironmentRepository;
//# sourceMappingURL=EnvironmentRepository.js.map