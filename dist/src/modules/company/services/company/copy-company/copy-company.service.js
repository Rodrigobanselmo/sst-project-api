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
exports.CopyCompanyService = void 0;
const CharacterizationRepository_1 = require("./../../../repositories/implementations/CharacterizationRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
const prisma_service_1 = require("./../../../../../prisma/prisma.service");
const RiskGroupDataRepository_1 = require("../../../../sst/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("./../../../repositories/implementations/HierarchyRepository");
const HomoGroupRepository_1 = require("./../../../repositories/implementations/HomoGroupRepository");
let CopyCompanyService = class CopyCompanyService {
    constructor(companyRepository, prisma, hierarchyRepository, homoGroupRepository, riskGroupDataRepository) {
        this.companyRepository = companyRepository;
        this.prisma = prisma;
        this.hierarchyRepository = hierarchyRepository;
        this.homoGroupRepository = homoGroupRepository;
        this.riskGroupDataRepository = riskGroupDataRepository;
    }
    async execute(companyCopyFromId, riskGroupFromId, user) {
        const companyId = user.targetCompanyId;
        const fromHierarchies = (await this.hierarchyRepository.findAllHierarchyByCompany(companyCopyFromId, {
            include: { workspaces: true },
            returnWorkspace: true,
        })).filter((hierarchy) => hierarchy.workspaces.length > 0);
        const targetHierarchies = (await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
            include: { workspaces: true },
            returnWorkspace: true,
        })).filter((hierarchy) => hierarchy.workspaces.length > 0);
        const { equalHierarchy, equalWorkspace } = await this.getCommonHierarchy(targetHierarchies, fromHierarchies);
        const company = await this.companyRepository.findById(companyCopyFromId, {
            include: {
                riskFactorGroupData: {
                    include: { usersSignatures: true, professionalsSignatures: true },
                },
            },
        });
        const fromRiskDataGroup = company.riskFactorGroupData.find((doc) => riskGroupFromId === doc.id);
        if (!(fromRiskDataGroup === null || fromRiskDataGroup === void 0 ? void 0 : fromRiskDataGroup.id))
            throw new common_1.BadRequestException('Documeto não encontrado');
        const homoGroups = await this.homoGroupRepository.findHomoGroupByCompany(companyCopyFromId, {
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
                    where: { riskFactorGroupDataId: riskGroupFromId },
                },
            },
        });
        const newRiskGroupData = await this.riskGroupDataRepository.upsert({
            companyId,
            approvedBy: fromRiskDataGroup.approvedBy,
            complementaryDocs: fromRiskDataGroup.complementaryDocs,
            complementarySystems: fromRiskDataGroup.complementarySystems,
            coordinatorBy: fromRiskDataGroup.coordinatorBy,
            elaboratedBy: fromRiskDataGroup.elaboratedBy,
            name: fromRiskDataGroup.name,
            professionals: fromRiskDataGroup.professionalsSignatures && fromRiskDataGroup.professionalsSignatures.length
                ? fromRiskDataGroup.professionalsSignatures.map((s) => ({
                    isSigner: s.isSigner,
                    isElaborator: s.isElaborator,
                    professionalId: s.professionalId,
                    riskFactorGroupDataId: s.riskFactorGroupDataId,
                }))
                : undefined,
            users: fromRiskDataGroup.usersSignatures && fromRiskDataGroup.usersSignatures.length
                ? fromRiskDataGroup.usersSignatures.map((s) => ({
                    isElaborator: s.isElaborator,
                    isSigner: s.isSigner,
                    userId: s.userId,
                    riskFactorGroupDataId: s.riskFactorGroupDataId,
                }))
                : undefined,
            revisionBy: fromRiskDataGroup.revisionBy,
            source: fromRiskDataGroup.source,
            visitDate: fromRiskDataGroup.visitDate,
            validityEnd: fromRiskDataGroup.validityEnd,
            validityStart: fromRiskDataGroup.validityStart,
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
                const hierarchies = [];
                group.hierarchies.map((hierarchy) => {
                    group.workspaceIds.map((workspaceId) => {
                        const hierarchyFound = equalHierarchy[hierarchy.id + '//' + workspaceId];
                        if (hierarchyFound && equalWorkspace[workspaceId])
                            hierarchyFound.forEach((h) => {
                                hierarchies.push(Object.assign(Object.assign({}, h), { workspaceId: equalWorkspace[workspaceId].id }));
                            });
                    });
                });
                if (hierarchies.length === 0)
                    return;
                let foundHomo = await this.prisma.homogeneousGroup.findUnique({
                    where: {
                        name_companyId: { name: group.name, companyId: companyId },
                    },
                });
                let newHomoGroup;
                const newHomoGroupId = (0, uuid_1.v4)();
                const createUpdateHomo = async (_newHomoGroupId) => {
                    if (group.type === client_1.HomoTypeEnum.HIERARCHY) {
                        foundHomo = await this.prisma.homogeneousGroup.findUnique({
                            where: {
                                id: _newHomoGroupId,
                            },
                        });
                    }
                    if (!foundHomo) {
                        newHomoGroup = await this.prisma.homogeneousGroup.create({
                            data: {
                                id: _newHomoGroupId,
                                description: group.description,
                                name: group.environment || group.characterization || group.type === client_1.HomoTypeEnum.HIERARCHY ? _newHomoGroupId : group.name,
                                companyId: companyId,
                                type: group.type,
                            },
                        });
                    }
                    else {
                        newHomoGroup = await this.prisma.homogeneousGroup.update({
                            where: { id: foundHomo.id },
                            data: {
                                companyId: companyId,
                                name: group.environment || group.characterization || group.type === client_1.HomoTypeEnum.HIERARCHY ? foundHomo.id : group.name,
                                type: group.type,
                                description: foundHomo.description ? group.description || undefined : undefined,
                            },
                        });
                    }
                };
                const createRiskFactorData = async (_newHomoGroupId) => {
                    await Promise.all(group.riskFactorData.map(async (riskFactorFromData) => {
                        const newRiskFactorData = await this.prisma.riskFactorData.create({
                            data: {
                                homogeneousGroupId: _newHomoGroupId,
                                riskId: riskFactorFromData.riskId,
                                riskFactorGroupDataId: newRiskGroupData.id,
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
                if (group.type === client_1.HomoTypeEnum.HIERARCHY) {
                    newHomoGroup = Object.assign({}, group);
                    await Promise.all(hierarchies.map(async (hierarchy) => {
                        await createUpdateHomo(hierarchy.id);
                        if (group.riskFactorData && group.riskFactorData.length) {
                            await createRiskFactorData(hierarchy.id);
                        }
                    }));
                }
                else {
                    await createUpdateHomo(newHomoGroupId);
                    if (group.characterization && equalWorkspace[group.characterization.workspaceId]) {
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
                                workspaceId: equalWorkspace[group.characterization.workspaceId].id,
                            },
                        });
                    }
                    if (group.riskFactorData && group.riskFactorData.length) {
                        await createRiskFactorData(newHomoGroup.id);
                    }
                }
                await Promise.all(hierarchies.map(async (hierarchy) => {
                    await this.prisma.hierarchyOnHomogeneous.upsert({
                        where: {
                            id: 0,
                        },
                        create: {
                            hierarchyId: hierarchy.id,
                            homogeneousGroupId: newHomoGroup.type === 'HIERARCHY' ? hierarchy.id : newHomoGroup.id,
                            workspaceId: hierarchy.workspaceId,
                        },
                        update: {},
                    });
                }));
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
CopyCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository,
        prisma_service_1.PrismaService,
        HierarchyRepository_1.HierarchyRepository,
        HomoGroupRepository_1.HomoGroupRepository,
        RiskGroupDataRepository_1.RiskGroupDataRepository])
], CopyCompanyService);
exports.CopyCompanyService = CopyCompanyService;
//# sourceMappingURL=copy-company.service.js.map