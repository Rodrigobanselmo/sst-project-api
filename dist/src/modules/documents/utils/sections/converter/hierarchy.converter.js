"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyConverter = void 0;
const client_1 = require("@prisma/client");
const homoGroup_entity_1 = require("../../../../company/entities/homoGroup.entity");
const removeDuplicate_1 = require("../../../../../shared/utils/removeDuplicate");
const first_constant_1 = require("../tables/riskInventory/parts/first/first.constant");
const setMapHierarchies = (hierarchyData) => {
    const hierarchyTree = {};
    const homoGroupTree = {};
    hierarchyData.forEach((hierarchy) => {
        hierarchyTree[hierarchy.id] = Object.assign(Object.assign({}, hierarchy), { children: [] });
        hierarchy.homogeneousGroups.forEach((homogeneousGroup) => {
            homoGroupTree[homogeneousGroup.id] = Object.assign({}, homogeneousGroup);
        });
    });
    Object.values(hierarchyTree).forEach((hierarchy) => {
        if (hierarchy.parentId) {
            hierarchyTree[hierarchy.parentId].children.push(hierarchy.id);
        }
    });
    return { hierarchyTree, homoGroupTree };
};
const hierarchyConverter = (hierarchies) => {
    const { hierarchyTree, homoGroupTree } = setMapHierarchies(hierarchies);
    const hierarchyData = new Map();
    hierarchies
        .filter((i) => [client_1.HierarchyEnum.OFFICE, client_1.HierarchyEnum.SUB_OFFICE].includes(i.type))
        .forEach((hierarchy) => {
        var _a, _b, _c;
        const hierarchyArrayData = [];
        const hierarchyInfo = first_constant_1.hierarchyMap[hierarchy.type];
        const allHomogeneousGroupIds = [];
        const loop = (parentId) => {
            var _a, _b;
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
                homogeneousGroup: ((_b = parent === null || parent === void 0 ? void 0 : parent.homogeneousGroups) === null || _b === void 0 ? void 0 : _b.map((group) => group.name).join(', ')) ||
                    '',
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
            homogeneousGroup: ((_b = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.homogeneousGroups) === null || _b === void 0 ? void 0 : _b.map((group) => group.name).join(', ')) ||
                '',
        };
        allHomogeneousGroupIds.push(...homogeneousGroupIds);
        loop(hierarchy.parentId);
        hierarchyData.set(hierarchy.id, {
            org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
            workspace: hierarchy.workspaces[0].name,
            descRh: hierarchy.description,
            descReal: hierarchy.realDescription,
            employeesLength: ((_c = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.employees) === null || _c === void 0 ? void 0 : _c.length) || 0,
            allHomogeneousGroupIds: (0, removeDuplicate_1.removeDuplicate)(allHomogeneousGroupIds, {
                simpleCompare: true,
            }),
        });
    });
    return { hierarchyData, homoGroupTree, hierarchyTree };
};
exports.hierarchyConverter = hierarchyConverter;
//# sourceMappingURL=hierarchy.converter.js.map