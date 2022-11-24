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
exports.CharacterizationRepository = exports.getCharacterizationType = exports.isEnvironment = void 0;
const data_sort_1 = require("./../../../../shared/utils/sorts/data.sort");
const risk_entity_1 = require("../../../sst/entities/risk.entity");
const riskData_entity_1 = require("../../../sst/entities/riskData.entity");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const characterization_entity_1 = require("../../entities/characterization.entity");
const hierarchy_entity_1 = require("../../entities/hierarchy.entity");
const isEnvironment = (type) => {
    return [
        client_1.CharacterizationTypeEnum.ADMINISTRATIVE,
        client_1.CharacterizationTypeEnum.OPERATION,
        client_1.CharacterizationTypeEnum.SUPPORT,
        client_1.CharacterizationTypeEnum.GENERAL,
    ].includes(type);
};
exports.isEnvironment = isEnvironment;
const getCharacterizationType = (type) => {
    if ((0, exports.isEnvironment)(type))
        return client_1.HomoTypeEnum.ENVIRONMENT;
    return type;
};
exports.getCharacterizationType = getCharacterizationType;
let CharacterizationRepository = class CharacterizationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a, isProfile) {
        var _b;
        var { id, companyId, workspaceId, hierarchyIds, type, profileParentId, startDate = null, endDate = null } = _a, characterizationDto = __rest(_a, ["id", "companyId", "workspaceId", "hierarchyIds", "type", "profileParentId", "startDate", "endDate"]);
        const newId = (0, uuid_1.v4)();
        if (hierarchyIds) {
            if (!workspaceId)
                throw new common_1.BadRequestException('Faltou identificar o estabelecimento para cadastrar os cargos');
            const homogeneousGroup = await this.prisma.homogeneousGroup.upsert({
                where: { id: id || 'no-id' },
                create: {
                    id: newId,
                    name: newId,
                    description: characterizationDto.name + '(//)' + type,
                    companyId: companyId,
                    type: (0, exports.getCharacterizationType)(type),
                },
                update: {
                    type: (0, exports.getCharacterizationType)(type),
                    description: characterizationDto.name + '(//)' + type,
                },
                include: {
                    hierarchyOnHomogeneous: {
                        where: {
                            hierarchyId: { in: hierarchyIds },
                            workspaceId,
                        },
                    },
                },
            });
            const hierarchyOnHomogeneous = {};
            homogeneousGroup.hierarchyOnHomogeneous
                .sort((a, b) => (0, data_sort_1.sortData)((b === null || b === void 0 ? void 0 : b.endDate) || new Date('3000-01-01T00:00:00.00Z'), (a === null || a === void 0 ? void 0 : a.endDate) || new Date('3000-01-01T00:00:00.00Z')))
                .forEach((hg) => {
                if (hierarchyOnHomogeneous[hg.hierarchyId])
                    return;
                if (!hg.startDate && !hg.endDate) {
                    hierarchyOnHomogeneous[hg.hierarchyId] = {};
                    hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id;
                    return;
                }
                if (endDate && !startDate) {
                    if (hg.startDate && !hg.endDate && hg.startDate < endDate) {
                        hierarchyOnHomogeneous[hg.hierarchyId] = {};
                        hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id;
                        hierarchyOnHomogeneous[hg.hierarchyId].startDate = undefined;
                        return;
                    }
                }
                const sameDate = hg.startDate == startDate || hg.endDate == endDate;
                if (sameDate) {
                    hierarchyOnHomogeneous[hg.hierarchyId] = {};
                    return (hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id);
                }
            });
            await Promise.all(hierarchyIds.map(async (hierarchyId) => {
                var _a;
                return await this.prisma.hierarchyOnHomogeneous.upsert({
                    where: { id: ((_a = hierarchyOnHomogeneous[hierarchyId]) === null || _a === void 0 ? void 0 : _a.id) || 0 },
                    create: {
                        hierarchyId,
                        workspaceId,
                        homogeneousGroupId: homogeneousGroup.id,
                        startDate,
                        endDate,
                    },
                    update: {
                        startDate: hierarchyOnHomogeneous[hierarchyId] && 'startDate' in hierarchyOnHomogeneous[hierarchyId] ? hierarchyOnHomogeneous[hierarchyId].startDate : startDate,
                        endDate: hierarchyOnHomogeneous[hierarchyId] && 'endDate' in hierarchyOnHomogeneous[hierarchyId] ? hierarchyOnHomogeneous[hierarchyId].endDate : endDate,
                    },
                });
            }));
        }
        const characterization = (await this.prisma.companyCharacterization.upsert({
            where: {
                workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
            },
            create: Object.assign(Object.assign({}, characterizationDto), { profileParentId: profileParentId || undefined, id: newId, companyId,
                workspaceId, type: type, name: characterizationDto.name }),
            update: Object.assign({ type, profileParentId: profileParentId || undefined }, characterizationDto),
            include: { profiles: true },
        }));
        characterization.profiles = await Promise.all((_b = characterization.profiles) === null || _b === void 0 ? void 0 : _b.map((profile) => {
            return this.upsert(Object.assign({ id: profile.id, companyId,
                workspaceId,
                type, profileParentId: profile.profileParentId }, (!!characterizationDto && {
                name: `${characterizationDto.name} - (${profile.profileName})`,
            })), true);
        }));
        return new characterization_entity_1.CharacterizationEntity(characterization);
    }
    async find(companyId, workspaceId, options) {
        const characterization = (await this.prisma.companyCharacterization.findMany(Object.assign({ where: {
                workspaceId,
                companyId,
                type: {
                    in: [client_1.CharacterizationTypeEnum.ACTIVITIES, client_1.CharacterizationTypeEnum.EQUIPMENT, client_1.CharacterizationTypeEnum.WORKSTATION],
                },
            } }, options)));
        return [...characterization.map((env) => new characterization_entity_1.CharacterizationEntity(env))];
    }
    async findAll(companyId, workspaceId, options) {
        const characterization = (await this.prisma.companyCharacterization.findMany(Object.assign({ where: {
                workspaceId,
                companyId,
                profileParentId: null,
            } }, options)));
        return [...characterization.map((env) => new characterization_entity_1.CharacterizationEntity(env))];
    }
    async findById(id, options = {}) {
        var _a;
        const characterization = (await this.prisma.companyCharacterization.findUnique({
            where: { id },
            include: Object.assign({ photos: true, profiles: true }, options.include),
        }));
        if (characterization) {
            const characterizationChildrenWithRisk = await Promise.all((_a = characterization.profiles) === null || _a === void 0 ? void 0 : _a.map(async (child) => {
                const profile = await this.getHierarchiesAndRisks(child.id, child, options);
                return profile;
            }));
            characterization.profiles = characterizationChildrenWithRisk;
        }
        return this.getHierarchiesAndRisks(id, characterization, options);
    }
    async delete(id, companyId, workspaceId) {
        const characterization = await this.prisma.companyCharacterization.delete({
            where: {
                workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
            },
        });
        return new characterization_entity_1.CharacterizationEntity(characterization);
    }
    async getHierarchiesAndRisks(id, characterization, options = {}) {
        if (!characterization)
            return characterization;
        const hierarchies = await this.prisma.hierarchy.findMany({
            where: {
                hierarchyOnHomogeneous: {
                    some: { homogeneousGroupId: characterization.id },
                },
            },
            include: {
                hierarchyOnHomogeneous: {
                    where: { homogeneousGroupId: characterization.id },
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
        return new characterization_entity_1.CharacterizationEntity(characterization);
    }
};
CharacterizationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CharacterizationRepository);
exports.CharacterizationRepository = CharacterizationRepository;
//# sourceMappingURL=CharacterizationRepository.js.map