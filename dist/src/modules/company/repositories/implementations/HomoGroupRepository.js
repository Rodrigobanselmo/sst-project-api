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
const removeDuplicate_1 = require("../../../../shared/utils/removeDuplicate");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const asyncEach_1 = require("../../../../shared/utils/asyncEach");
const homoGroup_entity_1 = require("../../entities/homoGroup.entity");
let HomoGroupRepository = class HomoGroupRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a, companyId) {
        var createHomoGroupDto = __rest(_a, []);
        const data = await this.prisma.homogeneousGroup.create({
            data: Object.assign(Object.assign({}, createHomoGroupDto), { companyId }),
        });
        return this.getHomoGroupData(data);
    }
    async update(_a) {
        var { id, hierarchies = [] } = _a, updateHomoGroup = __rest(_a, ["id", "hierarchies"]);
        const homoHierarchies = hierarchies.map((hierarchy) => ({
            hierarchyId_homogeneousGroupId_workspaceId: {
                hierarchyId: hierarchy.id,
                homogeneousGroupId: id,
                workspaceId: hierarchy.workspaceId,
            },
        }));
        await this.prisma.hierarchyOnHomogeneous.deleteMany({
            where: { homogeneousGroupId: id },
        });
        const addHomoHierarchies = async (value) => {
            await this.prisma.hierarchyOnHomogeneous.upsert({
                create: Object.assign({}, value.hierarchyId_homogeneousGroupId_workspaceId),
                update: {},
                where: value,
            });
        };
        await (0, asyncEach_1.asyncEach)(homoHierarchies, addHomoHierarchies);
        const data = await this.prisma.homogeneousGroup.update({
            where: { id },
            include: { hierarchyOnHomogeneous: { include: { hierarchy: true } } },
            data: Object.assign(Object.assign({}, updateHomoGroup), { hierarchyOnHomogeneous: homoHierarchies.length
                    ? {
                        set: homoHierarchies,
                    }
                    : undefined }),
        });
        const homoGroup = Object.assign({}, data);
        if (data.hierarchyOnHomogeneous)
            homoGroup.hierarchies = data.hierarchyOnHomogeneous.map((homo) => (Object.assign(Object.assign({}, homo.hierarchy), { workspaceId: homo.workspaceId })));
        return this.getHomoGroupData(homoGroup);
    }
    async deleteById(id) {
        await this.prisma.homogeneousGroup.delete({
            where: { id },
        });
    }
    async findHomoGroupByCompanyAndId(id, companyId) {
        const hierarchies = await this.prisma.homogeneousGroup.findFirst({
            where: { companyId, id },
        });
        return new homoGroup_entity_1.HomoGroupEntity(hierarchies);
    }
    async findHomoGroupByCompany(companyId) {
        const hierarchies = await this.prisma.homogeneousGroup.findMany({
            where: { companyId },
            include: { hierarchyOnHomogeneous: { include: { hierarchy: true } } },
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
        const hierarchiesIds = homogeneousGroup.hierarchies
            ? (0, removeDuplicate_1.removeDuplicate)(homogeneousGroup.hierarchies.map((h) => h.id))
            : [];
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
};
HomoGroupRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomoGroupRepository);
exports.HomoGroupRepository = HomoGroupRepository;
//# sourceMappingURL=HomoGroupRepository.js.map