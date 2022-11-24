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
exports.CopyCharacterizationService = void 0;
const CharacterizationRepository_1 = require("../../../repositories/implementations/CharacterizationRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const HomoGroupRepository_1 = require("../../../repositories/implementations/HomoGroupRepository");
let CopyCharacterizationService = class CopyCharacterizationService {
    constructor(prisma, homoGroupRepository) {
        this.prisma = prisma;
        this.homoGroupRepository = homoGroupRepository;
    }
    async execute({ companyCopyFromId, workspaceId, characterizationIds }, user) {
        const companyId = user.targetCompanyId;
        const sameCompany = companyId === companyCopyFromId;
        const actualCompany = await this.prisma.company.findFirst({
            where: {
                id: companyId,
            },
            include: {
                riskFactorGroupData: true,
            },
        });
        const company = await this.prisma.company.findFirst({
            where: Object.assign({ id: companyCopyFromId }, (!sameCompany && {
                receivingServiceContracts: {
                    some: { applyingServiceCompanyId: user.companyId },
                },
            })),
        });
        if (!(company === null || company === void 0 ? void 0 : company.id))
            throw new common_1.BadRequestException('Empresa não encontrado');
        const homoGroups = await this.homoGroupRepository.findHomoGroupByCompany(companyCopyFromId, {
            where: {
                characterization: {
                    OR: [{ id: { in: characterizationIds } }, { profileParentId: { in: characterizationIds } }],
                },
            },
            include: {
                characterization: {
                    include: {
                        profiles: {
                            include: {
                                homogeneousGroup: true,
                            },
                        },
                    },
                },
                riskFactorData: {
                    include: {
                        adms: true,
                        recs: true,
                        generateSources: true,
                        epiToRiskFactorData: { include: { epi: true } },
                        engsToRiskFactorData: { include: { recMed: true } },
                        hierarchy: true,
                        riskFactor: true,
                        probabilityCalc: true,
                        probabilityAfterCalc: true,
                    },
                },
            },
        });
        const createHomogeneous = async (homoGroupsCreation, profileParentId) => {
            homoGroupsCreation.map((homoGroup, i) => {
                if (homoGroup.characterization && (0, CharacterizationRepository_1.isEnvironment)(homoGroup.characterization.type)) {
                    homoGroupsCreation[i].environment = homoGroup.characterization;
                }
            });
            await Promise.all(homoGroupsCreation.map(async (group) => {
                var _a, _b, _c;
                if (!profileParentId && ((_a = group === null || group === void 0 ? void 0 : group.characterization) === null || _a === void 0 ? void 0 : _a.profileParentId))
                    return;
                if (profileParentId && !((_b = group === null || group === void 0 ? void 0 : group.characterization) === null || _b === void 0 ? void 0 : _b.profileParentId))
                    return;
                if (group.characterization && (0, CharacterizationRepository_1.isEnvironment)(group.characterization.type))
                    group.environment = group.characterization;
                let newHomoGroup;
                const newHomoGroupId = (0, uuid_1.v4)();
                const createUpdateHomo = async (_newHomoGroupId) => {
                    newHomoGroup = await this.prisma.homogeneousGroup.create({
                        data: {
                            id: _newHomoGroupId,
                            description: group.description,
                            name: _newHomoGroupId,
                            companyId: companyId,
                            type: group.type,
                        },
                    });
                };
                const createRiskFactorData = async (_newHomoGroupId) => {
                    await Promise.all(group.riskFactorData.map(async (riskFactorFromData) => {
                        const newRiskFactorData = await this.prisma.riskFactorData.create({
                            data: {
                                homogeneousGroupId: _newHomoGroupId,
                                riskId: riskFactorFromData.riskId,
                                riskFactorGroupDataId: actualCompany.riskFactorGroupData[0].id,
                                probabilityAfter: riskFactorFromData.probabilityAfter,
                                probability: riskFactorFromData.probability,
                                json: riskFactorFromData.json || undefined,
                                companyId,
                                generateSources: riskFactorFromData.generateSources && riskFactorFromData.generateSources.length
                                    ? {
                                        connect: riskFactorFromData.generateSources.map(({ id }) => ({
                                            id,
                                        })),
                                    }
                                    : undefined,
                                recs: riskFactorFromData.recs && riskFactorFromData.recs.length
                                    ? {
                                        connect: riskFactorFromData.recs.map(({ id }) => ({
                                            id,
                                        })),
                                    }
                                    : undefined,
                                adms: riskFactorFromData.adms && riskFactorFromData.adms.length
                                    ? {
                                        connect: riskFactorFromData.adms.map(({ id }) => ({
                                            id,
                                        })),
                                    }
                                    : undefined,
                            },
                        });
                        if (riskFactorFromData.epiToRiskFactorData && riskFactorFromData.epiToRiskFactorData.length)
                            await this.prisma.epiToRiskFactorData.createMany({
                                data: riskFactorFromData.epiToRiskFactorData.map((_a) => {
                                    var { epi } = _a, data = __rest(_a, ["epi"]);
                                    return (Object.assign(Object.assign({}, data), { riskFactorDataId: newRiskFactorData.id }));
                                }),
                            });
                        if (riskFactorFromData.engsToRiskFactorData && riskFactorFromData.engsToRiskFactorData.length)
                            await this.prisma.engsToRiskFactorData.createMany({
                                data: riskFactorFromData.engsToRiskFactorData.map((_a) => {
                                    var { recMed } = _a, data = __rest(_a, ["recMed"]);
                                    return (Object.assign(Object.assign({}, data), { riskFactorDataId: newRiskFactorData.id }));
                                }),
                            });
                        return newRiskFactorData;
                    }));
                };
                await createUpdateHomo(newHomoGroupId);
                if (group.characterization) {
                    await this.prisma.companyCharacterization.create({
                        data: {
                            id: newHomoGroup.id,
                            description: group.characterization.description,
                            name: group.characterization.name,
                            type: group.characterization.type,
                            activities: group.characterization.activities,
                            paragraphs: group.characterization.paragraphs,
                            considerations: group.characterization.considerations,
                            companyId: companyId,
                            profileName: group.characterization.profileName,
                            profileParentId: profileParentId || undefined,
                            order: group.characterization.order,
                            workspaceId: workspaceId,
                        },
                    });
                }
                if (group.riskFactorData && group.riskFactorData.length) {
                    await createRiskFactorData(newHomoGroup.id);
                }
                if ((_c = group.characterization) === null || _c === void 0 ? void 0 : _c.profiles) {
                    const profilesHomoGroups = group.characterization.profiles
                        .map((profile) => {
                        return homoGroups.find((homo) => homo.id === profile.id);
                    })
                        .filter((i) => i === null || i === void 0 ? void 0 : i.id);
                    await createHomogeneous(profilesHomoGroups, newHomoGroup.id);
                }
            }));
        };
        await createHomogeneous(homoGroups);
        return {};
    }
    async getCommonHierarchy(targetHierarchies, fromHierarchies) {
        const equalHierarchy = {};
        const equalWorkspace = {};
        [client_1.HierarchyEnum.DIRECTORY, client_1.HierarchyEnum.MANAGEMENT, client_1.HierarchyEnum.SECTOR, client_1.HierarchyEnum.SUB_SECTOR, client_1.HierarchyEnum.OFFICE, client_1.HierarchyEnum.SUB_OFFICE].forEach((hierarchyType) => {
            targetHierarchies.forEach((targetHierarchy) => {
                if (targetHierarchy.type !== hierarchyType)
                    return;
                fromHierarchies.find((hierarchyFrom) => {
                    const same = hierarchyFrom.id === targetHierarchy.refName;
                    if (same) {
                        equalWorkspace[hierarchyFrom.workspaces[0].id] = targetHierarchy.workspaces[0];
                        const old = equalHierarchy[hierarchyFrom.id + '//' + hierarchyFrom.workspaces[0].id] || [];
                        equalHierarchy[hierarchyFrom.id + '//' + hierarchyFrom.workspaces[0].id] = [targetHierarchy, ...old];
                    }
                });
            });
        });
        return { equalHierarchy, equalWorkspace };
    }
};
CopyCharacterizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, HomoGroupRepository_1.HomoGroupRepository])
], CopyCharacterizationService);
exports.CopyCharacterizationService = CopyCharacterizationService;
//# sourceMappingURL=copy-characterization.service.js.map