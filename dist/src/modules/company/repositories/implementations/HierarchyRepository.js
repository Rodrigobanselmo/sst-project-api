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
exports.HierarchyRepository = void 0;
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const hierarchy_entity_1 = require("../../entities/hierarchy.entity");
const CharacterizationRepository_1 = require("./CharacterizationRepository");
let HierarchyRepository = class HierarchyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertMany(upsertHierarchyMany, companyId, ghoNames) {
        let homogeneousGroup = [];
        if (upsertHierarchyMany && upsertHierarchyMany.length > 0)
            homogeneousGroup = ghoNames
                ? await this.prisma.$transaction(Object.entries(ghoNames).map(([ghoName, description]) => {
                    return this.prisma.homogeneousGroup.upsert({
                        create: {
                            company: { connect: { id: companyId } },
                            name: ghoName,
                            description: description || '',
                        },
                        update: Object.assign({ name: ghoName }, (description ? { description: description } : {})),
                        where: { name_companyId: { companyId, name: ghoName } },
                    });
                }))
                : await this.prisma.$transaction(upsertHierarchyMany
                    .filter(({ ghoName }) => ghoName)
                    .map(({ ghoName }) => {
                    return this.prisma.homogeneousGroup.upsert({
                        create: {
                            company: { connect: { id: companyId } },
                            name: ghoName,
                            description: '',
                        },
                        update: {
                            name: ghoName,
                        },
                        where: { name_companyId: { companyId, name: ghoName } },
                    });
                }));
        const HierarchyOnHomoGroup = [];
        const hierarchyOnHomogeneous = {};
        const foundHomogeneousGroups = await this.prisma.hierarchyOnHomogeneous.findMany({
            where: {
                hierarchyId: { in: upsertHierarchyMany.map((h) => h.id) },
            },
        });
        foundHomogeneousGroups.forEach((hg) => {
            var _a;
            const max = foundHomogeneousGroups.reduce((a, b) => {
                var _a;
                if (hg.hierarchyId !== b.hierarchyId)
                    return a;
                return Math.max(a, (_a = b === null || b === void 0 ? void 0 : b.endDate) === null || _a === void 0 ? void 0 : _a.getTime());
            }, 0);
            if ((((_a = hg === null || hg === void 0 ? void 0 : hg.endDate) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) == max) {
                hierarchyOnHomogeneous[hg.hierarchyId] = {};
                hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id;
            }
        });
        const data = await this.prisma.$transaction(upsertHierarchyMany.map((_a) => {
            var { companyId: _, id, workspaceIds, parentId, children, ghoName, employeesIds, name } = _a, upsertHierarchy = __rest(_a, ["companyId", "id", "workspaceIds", "parentId", "children", "ghoName", "employeesIds", "name"]);
            const isSubOffice = (upsertHierarchy === null || upsertHierarchy === void 0 ? void 0 : upsertHierarchy.type) == client_1.HierarchyEnum.SUB_OFFICE;
            const HierarchyOnHomo = !workspaceIds
                ? []
                : workspaceIds
                    .map((workspaceId) => {
                    var _a;
                    return ({
                        hierarchyId: id,
                        homogeneousGroupId: (_a = homogeneousGroup.find((homogeneous) => homogeneous.name === ghoName)) === null || _a === void 0 ? void 0 : _a.id,
                        workspaceId,
                        endDate: null,
                    });
                })
                    .filter((hierarchyOnHomo) => hierarchyOnHomo.homogeneousGroupId);
            HierarchyOnHomoGroup.push(...HierarchyOnHomo);
            return this.prisma.hierarchy.upsert({
                create: Object.assign(Object.assign({}, upsertHierarchy), { name: name.split('//')[0], id, company: { connect: { id: companyId } }, [isSubOffice ? 'subOfficeEmployees' : 'employees']: employeesIds && employeesIds.length
                        ? {
                            connect: employeesIds.map((id) => ({
                                id_companyId: { companyId, id },
                            })),
                        }
                        : undefined, workspaces: workspaceIds
                        ? {
                            connect: workspaceIds.map((id) => ({
                                id_companyId: { companyId, id },
                            })),
                        }
                        : undefined, parent: parentId
                        ? {
                            connect: { id: parentId },
                        }
                        : undefined }),
                update: Object.assign(Object.assign({}, upsertHierarchy), { name: name.split('//')[0], workspaces: !workspaceIds
                        ? undefined
                        : {
                            set: workspaceIds.map((id) => ({
                                id_companyId: { companyId, id },
                            })),
                        }, [isSubOffice ? 'subOfficeEmployees' : 'employees']: employeesIds && employeesIds.length
                        ? {
                            connect: employeesIds.map((id) => ({
                                id_companyId: { companyId, id },
                            })),
                        }
                        : undefined, parent: !parentId
                        ? parentId === null
                            ? { disconnect: true }
                            : undefined
                        : {
                            connect: { id: parentId },
                        } }),
                where: { id: id || 'none' },
                include: { workspaces: true },
            });
        }));
        await this.prisma.$transaction(HierarchyOnHomoGroup.map((hierarchyOnHomoGroup) => {
            var _a;
            return this.prisma.hierarchyOnHomogeneous.upsert({
                create: Object.assign(Object.assign({}, hierarchyOnHomoGroup), { startDate: null }),
                update: { endDate: null },
                where: {
                    id: ((_a = hierarchyOnHomogeneous[hierarchyOnHomoGroup.hierarchyId]) === null || _a === void 0 ? void 0 : _a.id) || 0,
                },
            });
        }));
        return data.map((hierarchy) => new hierarchy_entity_1.HierarchyEntity(hierarchy));
    }
    async updateSimpleMany(upsertHierarchyMany, companyId) {
        const data = await this.prisma.$transaction(upsertHierarchyMany.map((_a) => {
            var { id } = _a, upsertHierarchy = __rest(_a, ["id"]);
            return this.prisma.hierarchy.update({
                data: Object.assign(Object.assign({}, upsertHierarchy), { companyId,
                    id }),
                where: { id: id || 'none' },
            });
        }));
        return data.map((hierarchy) => new hierarchy_entity_1.HierarchyEntity(hierarchy));
    }
    async update(_a, companyId) {
        var { companyId: _, workspaceIds, parentId, id, children, name, employeesIds } = _a, updateHierarchy = __rest(_a, ["companyId", "workspaceIds", "parentId", "id", "children", "name", "employeesIds"]);
        const isSubOffice = (updateHierarchy === null || updateHierarchy === void 0 ? void 0 : updateHierarchy.type) == client_1.HierarchyEnum.SUB_OFFICE;
        const data = await this.prisma.hierarchy.update({
            where: { id },
            data: Object.assign(Object.assign({}, updateHierarchy), { name: name.split('//')[0], workspaces: !workspaceIds
                    ? undefined
                    : {
                        set: workspaceIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }, [isSubOffice ? 'subOfficeEmployees' : 'employees']: employeesIds && employeesIds.length
                    ? {
                        connect: employeesIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, parent: !parentId
                    ? undefined
                    : {
                        connect: {
                            id: parentId,
                        },
                    } }),
        });
        return new hierarchy_entity_1.HierarchyEntity(data);
    }
    async upsert(_a, companyId) {
        var { companyId: _, id, workspaceIds, parentId, children, name, employeesIds } = _a, upsertHierarchy = __rest(_a, ["companyId", "id", "workspaceIds", "parentId", "children", "name", "employeesIds"]);
        const isSubOffice = (upsertHierarchy === null || upsertHierarchy === void 0 ? void 0 : upsertHierarchy.type) == client_1.HierarchyEnum.SUB_OFFICE;
        const data = await this.prisma.hierarchy.upsert({
            create: Object.assign(Object.assign({}, upsertHierarchy), { id, name: name.split('//')[0], company: { connect: { id: companyId } }, workspaces: {
                    connect: workspaceIds.map((id) => ({
                        id_companyId: { companyId, id },
                    })),
                }, [isSubOffice ? 'subOfficeEmployees' : 'employees']: employeesIds && employeesIds.length
                    ? {
                        connect: employeesIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, parent: parentId
                    ? {
                        connect: { id: parentId },
                    }
                    : undefined }),
            update: Object.assign(Object.assign({}, upsertHierarchy), { name: name.split('//')[0], [isSubOffice ? 'subOfficeEmployees' : 'employees']: employeesIds && employeesIds.length
                    ? {
                        connect: employeesIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, workspaces: !workspaceIds
                    ? undefined
                    : {
                        set: workspaceIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }, parent: !parentId
                    ? undefined
                    : {
                        connect: { id: parentId },
                    } }),
            where: { id: id || 'none' },
        });
        return new hierarchy_entity_1.HierarchyEntity(data);
    }
    async upsertSubOffice(_a) {
        var { companyId, id, workspaceIds, parentId, name, employeesIds, historyIds } = _a, upsertHierarchy = __rest(_a, ["companyId", "id", "workspaceIds", "parentId", "name", "employeesIds", "historyIds"]);
        const data = await this.prisma.hierarchy.upsert({
            create: Object.assign(Object.assign(Object.assign(Object.assign({}, upsertHierarchy), { id, name: name.split('//')[0], company: { connect: { id: companyId } }, workspaces: {
                    connect: workspaceIds.map((id) => ({
                        id_companyId: { companyId, id },
                    })),
                } }), (employeesIds &&
                employeesIds.length && Object.assign({ subOfficeEmployees: {
                    connect: employeesIds.map((id) => ({
                        id_companyId: { companyId, id },
                    })),
                } }, (historyIds &&
                historyIds.length && {
                subHierarchyHistory: {
                    connect: historyIds.map((id) => ({
                        id,
                    })),
                },
            })))), { parent: {
                    connect: { id: parentId },
                } }),
            update: Object.assign(Object.assign({}, upsertHierarchy), { name: name.split('//')[0], employeeExamsHistorySubOffice: {
                    connect: historyIds.map((id) => ({
                        id,
                    })),
                }, subOfficeEmployees: employeesIds && employeesIds.length
                    ? {
                        connect: employeesIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }
                    : undefined, workspaces: !workspaceIds
                    ? undefined
                    : {
                        set: workspaceIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }, parent: !parentId
                    ? undefined
                    : {
                        connect: { id: parentId },
                    } }),
            where: { id: id || 'none' },
            include: { workspaces: true },
        });
        return new hierarchy_entity_1.HierarchyEntity(data);
    }
    async deleteById(id) {
        await this.prisma.hierarchy.delete({
            where: { id: id || 'none' },
        });
    }
    async findAllHierarchyByCompanyAndId(id, companyId) {
        const hierarchy = await this.prisma.hierarchy.findFirst({
            where: { companyId, id },
        });
        return new hierarchy_entity_1.HierarchyEntity(hierarchy);
    }
    async findAllHierarchyByCompany(companyId, _a = {}) {
        var { returnWorkspace } = _a, options = __rest(_a, ["returnWorkspace"]);
        const hierarchies = await this.prisma.hierarchy.findMany(Object.assign({ where: { companyId } }, options));
        return hierarchies.map((hierarchy) => {
            var _a, _b;
            if ((_a = hierarchy) === null || _a === void 0 ? void 0 : _a.workspaces) {
                hierarchy.workspaceIds = (_b = hierarchy) === null || _b === void 0 ? void 0 : _b.workspaces.map((workspace) => workspace.id);
                if (!returnWorkspace)
                    delete hierarchy.workspaces;
            }
            if ('hierarchyOnHomogeneous' in hierarchy) {
                const homogeneousGroup = Object.assign({}, hierarchy);
                if (hierarchy.hierarchyOnHomogeneous)
                    homogeneousGroup.homogeneousGroups = hierarchy.hierarchyOnHomogeneous.map((homo) => {
                        var _a, _b;
                        return (Object.assign(Object.assign({}, homo.homogeneousGroup), { workspaceId: homo.workspaceId, environment: ((_a = homo.homogeneousGroup) === null || _a === void 0 ? void 0 : _a.characterization) && (0, CharacterizationRepository_1.isEnvironment)(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined, characterization: ((_b = homo.homogeneousGroup) === null || _b === void 0 ? void 0 : _b.characterization) && !(0, CharacterizationRepository_1.isEnvironment)(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined }));
                    });
                return new hierarchy_entity_1.HierarchyEntity(homogeneousGroup);
            }
            return new hierarchy_entity_1.HierarchyEntity(hierarchy);
        });
    }
    async findAllDataHierarchyByCompany(companyId, workspaceId, options = {}) {
        const newOptions = Object.assign({}, options);
        const hierarchies = await this.prisma.hierarchy.findMany({
            where: { companyId, workspaces: { some: { id: workspaceId } } },
            include: {
                hierarchyOnHomogeneous: {
                    include: {
                        homogeneousGroup: {
                            include: { characterization: true, environment: true },
                        },
                    },
                    where: { endDate: null },
                },
                subOfficeEmployees: {
                    where: { hierarchy: { workspaces: { some: { id: workspaceId } } } },
                    include: { subOffices: true },
                },
                employees: {
                    where: { hierarchy: { workspaces: { some: { id: workspaceId } } } },
                },
                workspaces: true,
            },
        });
        return hierarchies.map((hierarchy) => {
            const hierarchyCopy = Object.assign({}, hierarchy);
            if (hierarchy.hierarchyOnHomogeneous)
                hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous.map((homo) => {
                    var _a, _b;
                    return (Object.assign(Object.assign({}, homo.homogeneousGroup), { workspaceId: homo.workspaceId, characterization: ((_a = homo.homogeneousGroup) === null || _a === void 0 ? void 0 : _a.characterization) && !(0, CharacterizationRepository_1.isEnvironment)(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined, environment: ((_b = homo.homogeneousGroup) === null || _b === void 0 ? void 0 : _b.characterization) && (0, CharacterizationRepository_1.isEnvironment)(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined }));
                });
            return new hierarchy_entity_1.HierarchyEntity(hierarchyCopy);
        });
    }
    async findById(id, companyId) {
        const hierarchiesIds = [];
        const AllChildrenHierarchies = (await this.prisma.hierarchy.findFirst({
            where: { id: { equals: id } },
            include: {
                workspaces: true,
                children: {
                    include: {
                        children: {
                            include: {
                                children: {
                                    include: {
                                        children: {
                                            include: {
                                                children: {
                                                    include: { children: true },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }));
        const getAllHierarchiesChildren = (hierarchies) => {
            hierarchies.forEach((hierarchy) => {
                hierarchiesIds.push(hierarchy.id);
                if (hierarchy.children)
                    getAllHierarchiesChildren(hierarchy.children);
            });
        };
        getAllHierarchiesChildren([AllChildrenHierarchies]);
        AllChildrenHierarchies.employeesCount = await this.prisma.employee.count({
            where: {
                companyId,
                hierarchyId: {
                    in: hierarchiesIds,
                },
            },
        });
        delete AllChildrenHierarchies.children;
        return new hierarchy_entity_1.HierarchyEntity(AllChildrenHierarchies);
    }
    async findByIdWithParent(id, companyId) {
        const hierarchies = (await this.prisma.hierarchy.findUnique({
            where: { id_companyId: { id, companyId } },
            include: {
                workspaces: true,
                parent: {
                    include: {
                        parent: {
                            include: {
                                parent: {
                                    include: {
                                        parent: {
                                            include: {
                                                parent: {
                                                    include: { parent: true },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }));
        return new hierarchy_entity_1.HierarchyEntity(hierarchies);
    }
    async find(query, pagination, options = {}) {
        const whereInit = Object.assign({ AND: [] }, options.where);
        options.orderBy = {
            name: 'asc',
        };
        options.select = Object.assign({ id: true, name: true, companyId: true, parentId: true, type: true }, options === null || options === void 0 ? void 0 : options.select);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search', 'homogeneousGroupId'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
            });
            delete query.search;
        }
        if ('homogeneousGroupId' in query) {
            where.AND.push({
                hierarchyOnHomogeneous: {
                    some: { homogeneousGroupId: query.homogeneousGroupId },
                },
            });
            options.select.hierarchyOnHomogeneous = {
                where: { homogeneousGroupId: query.homogeneousGroupId },
            };
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            this.prisma.hierarchy.count({
                where,
            }),
            this.prisma.hierarchy.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0 })),
        ]);
        return {
            data: response[1].map((hierarchy) => new hierarchy_entity_1.HierarchyEntity(hierarchy)),
            count: response[0],
        };
    }
    async findFirstNude(options = {}) {
        const data = await this.prisma.hierarchy.findFirst(Object.assign({}, options));
        return new hierarchy_entity_1.HierarchyEntity(data);
    }
};
HierarchyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HierarchyRepository);
exports.HierarchyRepository = HierarchyRepository;
//# sourceMappingURL=HierarchyRepository.js.map