"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyConverter = void 0;
const client_1 = require("@prisma/client");
const first_constant_1 = require("../parts/first/first.constant");
const setMapHierarchies = (hierarchyData) => {
    const hierarchyTree = {};
    hierarchyData.forEach((hierarchy) => {
        hierarchyTree[hierarchy.id] = Object.assign(Object.assign({}, hierarchy), { children: [] });
    });
    Object.values(hierarchyTree).forEach((hierarchy) => {
        if (hierarchy.parentId) {
            hierarchyTree[hierarchy.parentId].children.push(hierarchy.id);
        }
    });
    return hierarchyTree;
};
const hierarchyConverter = (hierarchies) => {
    const hierarchyTree = setMapHierarchies(hierarchies);
    const hierarchyData = new Map();
    hierarchies
        .filter((i) => [client_1.HierarchyEnum.OFFICE, client_1.HierarchyEnum.SUB_OFFICE].includes(i.type))
        .forEach((hierarchy) => {
        var _a, _b;
        const hierarchyArrayData = [];
        const hierarchyInfo = first_constant_1.hierarchyMap[hierarchy.type];
        const loop = (parentId) => {
            var _a;
            if (!parentId)
                return;
            const parent = hierarchyTree[parentId];
            const parentInfo = first_constant_1.hierarchyMap[parent.type];
            hierarchyArrayData[parentInfo.index] = {
                type: parentInfo.text,
                name: parent.name,
                homogeneousGroup: ((_a = parent === null || parent === void 0 ? void 0 : parent.homogeneousGroups) === null || _a === void 0 ? void 0 : _a.map((group) => group.name).join(', ')) ||
                    '',
            };
            loop(parent.parentId);
        };
        hierarchyArrayData[hierarchyInfo.index] = {
            type: hierarchyInfo.text,
            name: hierarchy.name,
            homogeneousGroup: ((_a = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.homogeneousGroups) === null || _a === void 0 ? void 0 : _a.map((group) => group.name).join(', ')) ||
                '',
        };
        loop(hierarchy.parentId);
        hierarchyData.set(hierarchy.id, {
            org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
            workspace: hierarchy.workspaces[0].name,
            descRh: hierarchy.description,
            descReal: hierarchy.realDescription,
            employeesLength: ((_b = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.employees) === null || _b === void 0 ? void 0 : _b.length) || 0,
        });
    });
    return hierarchyData;
};
exports.hierarchyConverter = hierarchyConverter;
//# sourceMappingURL=hierarchy.converter.js.map