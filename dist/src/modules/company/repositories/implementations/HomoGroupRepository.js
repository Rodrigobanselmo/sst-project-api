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
exports.HomoGroupRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const removeDuplicate_1 = require("../../../../shared/utils/removeDuplicate");
const homoGroup_entity_1 = require("../../entities/homoGroup.entity");
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
const data_sort_1 = require("./../../../../shared/utils/sorts/data.sort");
let HomoGroupRepository = class HomoGroupRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a, companyId) {
        var { hierarchies, endDate = null, startDate = null } = _a, createHomoGroupDto = __rest(_a, ["hierarchies", "endDate", "startDate"]);
        const data = await this.prisma.homogeneousGroup.create({
            data: Object.assign(Object.assign({}, createHomoGroupDto), { companyId }),
        });
        if (hierarchies) {
            await Promise.all(hierarchies.map(async ({ id: hierarchyId, workspaceId }) => await this.prisma.hierarchyOnHomogeneous.create({
                data: {
                    hierarchyId,
                    workspaceId,
                    homogeneousGroupId: data.id,
                    startDate,
                    endDate,
                },
            })));
        }
        return this.getHomoGroupData(data);
    }
    async update(_a) {
        var { id, hierarchies, endDate = null, startDate = null } = _a, updateHomoGroup = __rest(_a, ["id", "hierarchies", "endDate", "startDate"]);
        if (hierarchies) {
            const hierarchyOnHomogeneous = {};
            const foundHomogeneousGroups = await this.prisma.hierarchyOnHomogeneous.findMany({
                where: {
                    homogeneousGroupId: id,
                    hierarchyId: { in: hierarchies.map((h) => h.id) },
                },
            });
            foundHomogeneousGroups
                .sort((a, b) => (0, data_sort_1.sortData)((b === null || b === void 0 ? void 0 : b.endDate) || new Date('3000-01-01T00:00:00.00Z'), (a === null || a === void 0 ? void 0 : a.endDate) || new Date('3000-01-01T00:00:00.00Z')))
                .forEach((hg) => {
                if (hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId])
                    return;
                if (!hg.startDate && !hg.endDate) {
                    hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId] = {};
                    hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].id = hg.id;
                    return;
                }
                if (endDate && !startDate) {
                    if (hg.startDate && !hg.endDate && hg.startDate < endDate) {
                        hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId] = {};
                        hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].id = hg.id;
                        hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].startDate = undefined;
                        return;
                    }
                }
                const sameDate = hg.startDate == startDate || hg.endDate == endDate;
                if (sameDate) {
                    hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId] = {};
                    return (hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].id = hg.id);
                }
            });
            await Promise.all(hierarchies.map(async ({ id: hierarchyId, workspaceId }) => {
                var _a;
                return await this.prisma.hierarchyOnHomogeneous.upsert({
                    where: {
                        id: ((_a = hierarchyOnHomogeneous[hierarchyId + workspaceId]) === null || _a === void 0 ? void 0 : _a.id) || 0,
                    },
                    create: {
                        hierarchyId,
                        workspaceId,
                        homogeneousGroupId: id,
                        startDate,
                        endDate,
                    },
                    update: {
                        startDate: hierarchyOnHomogeneous[hierarchyId + workspaceId] && 'startDate' in hierarchyOnHomogeneous[hierarchyId + workspaceId]
                            ? hierarchyOnHomogeneous[hierarchyId + workspaceId].startDate
                            : startDate,
                        endDate: hierarchyOnHomogeneous[hierarchyId + workspaceId] && 'endDate' in hierarchyOnHomogeneous[hierarchyId + workspaceId]
                            ? hierarchyOnHomogeneous[hierarchyId + workspaceId].endDate
                            : endDate,
                    },
                });
            }));
        }
        const data = await this.prisma.homogeneousGroup.update({
            where: { id },
            include: { hierarchyOnHomogeneous: { include: { hierarchy: true } } },
            data: Object.assign({}, updateHomoGroup),
        });
        const homoGroup = Object.assign({}, data);
        if (data.hierarchyOnHomogeneous)
            homoGroup.hierarchies = data.hierarchyOnHomogeneous.map((homo) => (Object.assign(Object.assign({}, homo.hierarchy), { workspaceId: homo.workspaceId })));
        return this.getHomoGroupData(homoGroup);
    }
    async updateHierarchyHomo({ ids, workspaceId, endDate = null, startDate = null }) {
        return this.prisma.hierarchyOnHomogeneous.updateMany({
            where: { id: { in: ids }, workspaceId },
            data: {
                startDate,
                endDate,
            },
        });
    }
    async findHomoGroupByCompanyAndId(id, companyId, options) {
        const hierarchies = await this.prisma.homogeneousGroup.findFirst(Object.assign({ where: { companyId, id } }, options));
        return new homoGroup_entity_1.HomoGroupEntity(hierarchies);
    }
    async find(query, pagination, options = {}) {
        const whereInit = Object.assign({ AND: [], type: null }, options.where);
        options.orderBy = {
            name: 'asc',
        };
        options.select = Object.assign({ id: true, name: true, companyId: true, status: true, type: true }, options === null || options === void 0 ? void 0 : options.select);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search', 'type'],
        });
        if ('search' in query) {
            where.AND.push({
                name: { contains: query.search, mode: 'insensitive' },
            });
        }
        if ('type' in query) {
            where.type.type = { in: query.type };
        }
        const response = await this.prisma.$transaction([
            this.prisma.homogeneousGroup.count({
                where,
            }),
            this.prisma.homogeneousGroup.findMany(Object.assign(Object.assign({ take: pagination.take || 20, skip: pagination.skip || 0 }, options), { where })),
        ]);
        return {
            data: response[1].map((employee) => new homoGroup_entity_1.HomoGroupEntity(employee)),
            count: response[0],
        };
    }
    async findFirstNude(options) {
        const homo = await this.prisma.homogeneousGroup.findFirst(Object.assign({}, options));
        return new homoGroup_entity_1.HomoGroupEntity(homo);
    }
    async findById(id, companyId, options) {
        const homo = await this.prisma.homogeneousGroup.findFirst(Object.assign({ where: { id, companyId }, include: {
                hierarchyOnHomogeneous: {
                    include: {
                        hierarchy: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                workspaces: { select: { id: true } },
                            },
                        },
                    },
                },
            } }, options));
        return new homoGroup_entity_1.HomoGroupEntity(homo);
    }
    async findHomoGroupByCompanyAndName(name, companyId) {
        const hierarchies = await this.prisma.homogeneousGroup.findFirst({
            where: { companyId, name },
        });
        return new homoGroup_entity_1.HomoGroupEntity(hierarchies);
    }
    async findHomoGroupByCompany(companyId, options = {}) {
        const hierarchies = await this.prisma.homogeneousGroup.findMany({
            where: Object.assign({ companyId }, options.where),
            include: Object.assign({ hierarchyOnHomogeneous: { include: { hierarchy: true } } }, options.include),
        });
        const homogeneousGroup = await Promise.all(hierarchies.map(async (homoGroup) => {
            return await this.getHomoGroupData(homoGroup);
        }));
        return homogeneousGroup;
    }
    async getHomoGroupData(homoGroup) {
        const homogeneousGroup = Object.assign({}, homoGroup);
        const companyId = homoGroup.companyId;
        const workplacesIds = new Set();
        if (homoGroup.hierarchyOnHomogeneous)
            homogeneousGroup.hierarchies = homoGroup.hierarchyOnHomogeneous.map((homo) => {
                workplacesIds.add(homo.workspaceId);
                return Object.assign(Object.assign({}, homo.hierarchy), { workspaceId: homo.workspaceId });
            });
        homogeneousGroup.workspaceIds = Array.from(workplacesIds);
        const hierarchiesIds = homogeneousGroup.hierarchies ? (0, removeDuplicate_1.removeDuplicate)(homogeneousGroup.hierarchies.map((h) => h.id)) : [];
        const where = {
            companyId,
            workspaces: {
                some: {
                    OR: homogeneousGroup.workspaceIds.map((workspaceId) => ({
                        id: workspaceId,
                    })),
                },
            },
        };
        const AllChildrenHierarchies = await this.prisma.hierarchy.findMany({
            where: Object.assign({ parentId: { in: hierarchiesIds } }, where),
            include: {
                children: {
                    where,
                    include: {
                        children: {
                            where,
                            include: {
                                children: {
                                    where,
                                    include: {
                                        children: {
                                            where,
                                            include: {
                                                children: {
                                                    include: { children: true },
                                                    where,
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
        });
        const getAllHierarchiesChildren = async (hierarchies) => {
            hierarchies.forEach((hierarchy) => {
                hierarchiesIds.push(hierarchy.id);
                if (hierarchy.children)
                    getAllHierarchiesChildren(hierarchy.children);
            });
        };
        await getAllHierarchiesChildren(AllChildrenHierarchies);
        homogeneousGroup.employeeCount = await this.prisma.employee.count({
            where: {
                companyId,
                hierarchyId: {
                    in: hierarchiesIds,
                },
            },
        });
        return new homoGroup_entity_1.HomoGroupEntity(homogeneousGroup);
    }
    async deleteById(id) {
        await this.prisma.hierarchyOnHomogeneous.deleteMany({
            where: { homogeneousGroupId: id },
        });
        await this.prisma.riskFactorData.deleteMany({
            where: { homogeneousGroupId: id },
        });
        await this.prisma.homogeneousGroup.delete({
            where: { id },
        });
    }
};
HomoGroupRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomoGroupRepository);
exports.HomoGroupRepository = HomoGroupRepository;
//# sourceMappingURL=HomoGroupRepository.js.map