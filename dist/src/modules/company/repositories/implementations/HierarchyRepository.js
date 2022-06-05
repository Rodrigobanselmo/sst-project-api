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
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const hierarchy_entity_1 = require("../../entities/hierarchy.entity");
let HierarchyRepository = class HierarchyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertMany(upsertHierarchyMany, companyId) {
        const data = await this.prisma.$transaction(upsertHierarchyMany.map((_a) => {
            var { companyId: _, id, workspaceIds, parentId, children } = _a, upsertHierarchy = __rest(_a, ["companyId", "id", "workspaceIds", "parentId", "children"]);
            return this.prisma.hierarchy.upsert({
                create: Object.assign(Object.assign({}, upsertHierarchy), { id, company: { connect: { id: companyId } }, workspaces: {
                        connect: workspaceIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }, parent: parentId
                        ? {
                            connect: { id: parentId },
                        }
                        : undefined }),
                update: Object.assign(Object.assign({}, upsertHierarchy), { workspaces: !workspaceIds
                        ? undefined
                        : {
                            set: workspaceIds.map((id) => ({
                                id_companyId: { companyId, id },
                            })),
                        }, parent: !parentId
                        ? parentId === null
                            ? { disconnect: true }
                            : undefined
                        : {
                            connect: { id: parentId },
                        } }),
                where: { id: id || 'none' },
            });
        }));
        return data.map((hierarchy) => new hierarchy_entity_1.HierarchyEntity(hierarchy));
    }
    async update(_a, companyId) {
        var { companyId: _, workspaceIds, parentId, id, children } = _a, updateHierarchy = __rest(_a, ["companyId", "workspaceIds", "parentId", "id", "children"]);
        const data = await this.prisma.hierarchy.update({
            where: { id },
            data: Object.assign(Object.assign({}, updateHierarchy), { workspaces: !workspaceIds
                    ? undefined
                    : {
                        set: workspaceIds.map((id) => ({
                            id_companyId: { companyId, id },
                        })),
                    }, parent: !parentId
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
        var { companyId: _, id, workspaceIds, parentId, children } = _a, upsertHierarchy = __rest(_a, ["companyId", "id", "workspaceIds", "parentId", "children"]);
        const data = await this.prisma.hierarchy.upsert({
            create: Object.assign(Object.assign({}, upsertHierarchy), { id, company: { connect: { id: companyId } }, workspaces: {
                    connect: workspaceIds.map((id) => ({
                        id_companyId: { companyId, id },
                    })),
                }, parent: parentId
                    ? {
                        connect: { id: parentId },
                    }
                    : undefined }),
            update: Object.assign(Object.assign({}, upsertHierarchy), { workspaces: !workspaceIds
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
    async findAllHierarchyByCompany(companyId, options = {}) {
        const hierarchies = await this.prisma.hierarchy.findMany(Object.assign({ where: { companyId } }, options));
        return hierarchies.map((hierarchy) => {
            var _a, _b;
            if ((_a = hierarchy) === null || _a === void 0 ? void 0 : _a.workspaces) {
                hierarchy.workspaceIds = (_b = hierarchy) === null || _b === void 0 ? void 0 : _b.workspaces.map((workspace) => workspace.id);
                delete hierarchy.workspaces;
            }
            return new hierarchy_entity_1.HierarchyEntity(hierarchy);
        });
    }
    async findAllDataHierarchyByCompany(companyId, workspaceId, options = {}) {
        const newOptions = Object.assign({}, options);
        const hierarchies = await this.prisma.hierarchy.findMany({
            where: { companyId, workspaces: { some: { id: workspaceId } } },
            include: {
                hierarchyOnHomogeneous: { include: { homogeneousGroup: true } },
                employees: { where: { workspaces: { some: { id: workspaceId } } } },
                workspaces: true,
            },
        });
        return hierarchies.map((hierarchy) => {
            const homogeneousGroup = Object.assign({}, hierarchy);
            if (hierarchy.hierarchyOnHomogeneous)
                homogeneousGroup.homogeneousGroups =
                    hierarchy.hierarchyOnHomogeneous.map((homo) => (Object.assign(Object.assign({}, homo.homogeneousGroup), { workspaceId: homo.workspaceId })));
            return new hierarchy_entity_1.HierarchyEntity(hierarchy);
        });
    }
};
HierarchyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HierarchyRepository);
exports.HierarchyRepository = HierarchyRepository;
//# sourceMappingURL=HierarchyRepository.js.map