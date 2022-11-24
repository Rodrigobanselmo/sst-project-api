"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyConverter = void 0;
const client_1 = require("@prisma/client");
const removeDuplicate_1 = require("../../../../shared/utils/removeDuplicate");
const first_constant_1 = require("../components/tables/appr/parts/first/first.constant");
const setMapHierarchies = (hierarchyData) => {
    const hierarchyTree = {};
    const homoGroupTree = {};
    hierarchyData.forEach((hierarchy) => {
        hierarchyTree[hierarchy.id] = Object.assign(Object.assign({}, hierarchy), { children: [] });
    });
    Object.values(hierarchyTree).forEach((hierarchy) => {
        if (hierarchy.parentId) {
            hierarchyTree[hierarchy.parentId].children.push(hierarchy.id);
            if (!hierarchyTree[hierarchy.parentId].employees)
                hierarchyTree[hierarchy.parentId].employees = [];
            if (hierarchy.type !== 'SUB_OFFICE')
                hierarchyTree[hierarchy.parentId].employees.push(...hierarchy.employees);
        }
    });
    Object.values(hierarchyTree).forEach((h) => {
        hierarchyTree[h.id].employees = (0, removeDuplicate_1.removeDuplicate)(hierarchyTree[h.id].employees, { removeById: 'id' });
        const hierarchy = hierarchyTree[h.id];
        hierarchy.homogeneousGroups.forEach((homogeneousGroup) => {
            if (!homoGroupTree[homogeneousGroup.id])
                homoGroupTree[homogeneousGroup.id] = {
                    hierarchies: [],
                };
            homoGroupTree[homogeneousGroup.id] = Object.assign(Object.assign({}, homogeneousGroup), { hierarchies: [...homoGroupTree[homogeneousGroup.id].hierarchies, hierarchy] });
        });
    });
    Object.values(homoGroupTree).forEach((homoGroup) => {
        const employees = [];
        homoGroupTree[homoGroup.id].hierarchies.forEach((h) => {
            employees.push(...h.employees);
        });
        homoGroupTree[homoGroup.id].employeeCount = (0, removeDuplicate_1.removeDuplicate)(employees, {
            removeById: 'id',
        }).length;
    });
    return { hierarchyTree, homoGroupTree };
};
const hierarchyConverter = (hierarchies, environments = [], { workspaceId } = {}) => {
    const { hierarchyTree, homoGroupTree } = setMapHierarchies(hierarchies);
    const hierarchyData = new Map();
    const hierarchyHighLevelsData = new Map();
    hierarchies.forEach((hierarchy) => {
        var _a, _b, _c, _d, _e;
        const hierarchyArrayData = [];
        const hierarchyInfo = first_constant_1.hierarchyMap[hierarchy.type];
        const allHomogeneousGroupIds = [];
        const loop = (parentId) => {
            var _a, _b, _c;
            if (!parentId)
                return;
            const parent = hierarchyTree[parentId];
            const parentInfo = first_constant_1.hierarchyMap[parent.type];
            const homogeneousGroupIds = ((_a = parent === null || parent === void 0 ? void 0 : parent.homogeneousGroups) === null || _a === void 0 ? void 0 : _a.map((group) => group.id)) || [];
            allHomogeneousGroupIds.push(...homogeneousGroupIds);
            hierarchyArrayData[parentInfo.index] = {
                type: parentInfo.text,
                typeEnum: parent.type,
                name: parent.name,
                id: parent.id,
                homogeneousGroupIds,
                environments: ((_b = parent === null || parent === void 0 ? void 0 : parent.homogeneousGroups) === null || _b === void 0 ? void 0 : _b.map((group) => {
                    var _a;
                    if (group.type != client_1.HomoTypeEnum.ENVIRONMENT)
                        return;
                    return ((_a = (environments.find((e) => e.id === group.id) || {})) === null || _a === void 0 ? void 0 : _a.name) || '';
                }).filter((e) => e).join(', ')) || '',
                homogeneousGroup: ((_c = parent === null || parent === void 0 ? void 0 : parent.homogeneousGroups) === null || _c === void 0 ? void 0 : _c.map((group) => {
                    if (group.type)
                        return false;
                    return group.name;
                }).filter((e) => e).join(', ')) || '',
            };
            loop(parent.parentId);
        };
        const homogeneousGroupIds = ((_a = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.homogeneousGroups) === null || _a === void 0 ? void 0 : _a.map((group) => group.id)) || [];
        hierarchyArrayData[hierarchyInfo.index] = {
            type: hierarchyInfo.text,
            typeEnum: hierarchy.type,
            name: hierarchy.name,
            id: hierarchy.id,
            homogeneousGroupIds,
            environments: ((_b = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.homogeneousGroups) === null || _b === void 0 ? void 0 : _b.map((group) => {
                var _a;
                if (group.type != client_1.HomoTypeEnum.ENVIRONMENT)
                    return;
                return ((_a = (environments.find((e) => e.id === group.id) || {})) === null || _a === void 0 ? void 0 : _a.name) || '';
            }).filter((e) => e).join(', ')) || '',
            homogeneousGroup: ((_c = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.homogeneousGroups) === null || _c === void 0 ? void 0 : _c.map((group) => {
                if (group.type)
                    return false;
                return group.name;
            }).filter((e) => e).join(', ')) || '',
        };
        allHomogeneousGroupIds.push(...homogeneousGroupIds);
        loop(hierarchy.parentId);
        const isOffice = [client_1.HierarchyEnum.OFFICE, client_1.HierarchyEnum.SUB_OFFICE].includes(hierarchy.type);
        const workspace = workspaceId ? hierarchy.workspaces.find((workspace) => workspace.id === workspaceId) || hierarchy.workspaces[0] : hierarchy.workspaces[0];
        if (isOffice)
            hierarchyData.set(hierarchy.id, {
                org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
                workspace: workspace.name,
                descRh: hierarchy.description,
                descReal: hierarchy.realDescription,
                employeesLength: ((_d = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.employees) === null || _d === void 0 ? void 0 : _d.length) || 0,
                allHomogeneousGroupIds: (0, removeDuplicate_1.removeDuplicate)(allHomogeneousGroupIds, {
                    simpleCompare: true,
                }),
            });
        hierarchyHighLevelsData.set(hierarchy.id, {
            org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
            workspace: workspace.name,
            descRh: hierarchy.description,
            descReal: hierarchy.realDescription,
            employeesLength: ((_e = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.employees) === null || _e === void 0 ? void 0 : _e.length) || 0,
            allHomogeneousGroupIds: (0, removeDuplicate_1.removeDuplicate)(allHomogeneousGroupIds, {
                simpleCompare: true,
            }),
        });
    });
    return {
        hierarchyData,
        hierarchyHighLevelsData,
        homoGroupTree,
        hierarchyTree,
    };
};
exports.hierarchyConverter = hierarchyConverter;
//# sourceMappingURL=hierarchy.converter.js.map