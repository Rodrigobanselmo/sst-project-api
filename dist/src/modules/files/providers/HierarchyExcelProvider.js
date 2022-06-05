"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyExcelProvider = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const removeDuplicate_1 = require("../../../shared/utils/removeDuplicate");
let HierarchyExcelProvider = class HierarchyExcelProvider {
    transformArrayToHierarchyMapTree(hierarchies) {
        const hierarchyTree = hierarchies.reduce((acc, node) => {
            acc[node.id] = Object.assign(Object.assign({}, node), { parentId: node.parentId || null, children: [] });
            return acc;
        }, {});
        Object.values(hierarchyTree).forEach((node) => {
            if (node.parentId) {
                hierarchyTree[node.parentId].children.push(node.id);
            }
        });
        return hierarchyTree;
    }
    createTreeMapFromHierarchyStruct(hierarchies) {
        const hierarchyMap = {};
        hierarchies.forEach((hierarchy) => {
            let orderedHierarchy = [];
            Object.entries(hierarchy).forEach(([key, value]) => {
                if (key === 'directory' && value)
                    orderedHierarchy[0] = { key, value: value, id: (0, uuid_1.v4)() };
                if (key === 'management' && value)
                    orderedHierarchy[1] = { key, value: value, id: (0, uuid_1.v4)() };
                if (key === 'sector' && value)
                    orderedHierarchy[2] = { key, value: value, id: (0, uuid_1.v4)() };
                if (key === 'sub_sector' && value)
                    orderedHierarchy[3] = { key, value: value, id: (0, uuid_1.v4)() };
                if (key === 'office' && value)
                    orderedHierarchy[4] = { key, value: value, id: (0, uuid_1.v4)() };
                if (key === 'sub_office' && value)
                    orderedHierarchy[5] = { key, value: value, id: (0, uuid_1.v4)() };
            });
            orderedHierarchy = orderedHierarchy.filter((i) => i);
            orderedHierarchy
                .filter((i) => i)
                .forEach((employeeWork, index) => {
                if (employeeWork) {
                    const id = employeeWork.id;
                    if (!hierarchyMap[id])
                        hierarchyMap[id] = {};
                    hierarchyMap[id].id = id;
                    hierarchyMap[id].workspaceIds = hierarchy.workspaceIds;
                    hierarchyMap[id].name = employeeWork.value;
                    hierarchyMap[id].type =
                        employeeWork.key.toUpperCase();
                    hierarchyMap[id].parentId =
                        index === 0 ? null : orderedHierarchy[index - 1].id;
                    if (orderedHierarchy[index - 1] && index !== 0) {
                        const _id = orderedHierarchy[index - 1].id;
                        if (!hierarchyMap[_id].children) {
                            hierarchyMap[_id].children = [];
                        }
                        hierarchyMap[_id].children.push(id);
                    }
                }
            });
        });
        return hierarchyMap;
    }
    compare(allMap, compareMap) {
        const newHierarchy = Object.assign({}, compareMap);
        const isEqualHierarchy = (h1, h2, parent) => {
            const firstEqual = h1.name === h2.name && h1.type === h2.type;
            if (parent) {
                if (newHierarchy[h1.parentId] && newHierarchy[h2.parentId]) {
                    const parentEqual = isEqualHierarchy(newHierarchy[h1.parentId], newHierarchy[h2.parentId]);
                    return parentEqual && firstEqual;
                }
                if (h1.parentId === h2.parentId && h2.parentId === null)
                    return firstEqual;
                return false;
            }
            return firstEqual;
        };
        const replaceAndEditIfEqual = (allHierarchy, hierarchy, parentId) => {
            if (!newHierarchy[allHierarchy.id])
                newHierarchy[allHierarchy.id] = Object.assign(Object.assign({}, allHierarchy), { fromOld: true });
            if (newHierarchy[allHierarchy.id].workspaceIds && hierarchy.workspaceId) {
                newHierarchy[allHierarchy.id].workspaceIds = (0, removeDuplicate_1.removeDuplicate)([
                    ...newHierarchy[allHierarchy.id].workspaceIds,
                    ...hierarchy.workspaceId,
                ], { simpleCompare: true });
            }
            if (parentId)
                newHierarchy[allHierarchy.id].parentId = parentId;
            if (newHierarchy[hierarchy.id].children)
                newHierarchy[hierarchy.id].children.forEach((childId) => {
                    if (!newHierarchy[allHierarchy.id].children)
                        newHierarchy[allHierarchy.id].children = [];
                    newHierarchy[allHierarchy.id].children.push(childId);
                    newHierarchy[childId].parentId = allHierarchy.id;
                    newHierarchy[childId].connectedToOldId =
                        allHierarchy.connectedToOldId || allHierarchy.id;
                });
            delete newHierarchy[hierarchy.id];
            newHierarchy[hierarchy.id] = { refId: allHierarchy.id };
        };
        Object.keys(client_1.HierarchyEnum).forEach((type) => Object.values(compareMap)
            .filter((i) => i.type === type)
            .forEach((hierarchy) => {
            if (!newHierarchy[hierarchy.id])
                return;
            const parentId = newHierarchy[hierarchy.id].parentId;
            const connectedToOldId = newHierarchy[hierarchy.id].connectedToOldId;
            const equalAllHierarchy = Object.values(allMap).find((i) => isEqualHierarchy(i, hierarchy));
            if (equalAllHierarchy) {
                if (!parentId || parentId === equalAllHierarchy.parentId) {
                    replaceAndEditIfEqual(equalAllHierarchy, hierarchy);
                }
                else if (connectedToOldId === equalAllHierarchy.parentId) {
                    replaceAndEditIfEqual(equalAllHierarchy, hierarchy, parentId);
                }
            }
            if (newHierarchy[hierarchy.id] &&
                newHierarchy[hierarchy.id].parentId &&
                newHierarchy[newHierarchy[hierarchy.id].parentId] &&
                newHierarchy[newHierarchy[hierarchy.id].parentId].connectedToOldId) {
                newHierarchy[hierarchy.id].connectedToOldId =
                    newHierarchy[newHierarchy[hierarchy.id].parentId].connectedToOldId;
            }
            const equalHierarchy = Object.values(newHierarchy).find((i) => !i.fromOld &&
                i.id !== hierarchy.id &&
                isEqualHierarchy(i, hierarchy, true));
            if (equalHierarchy && newHierarchy[hierarchy.id]) {
                replaceAndEditIfEqual(equalHierarchy, hierarchy);
            }
        }));
        return newHierarchy;
    }
};
HierarchyExcelProvider = __decorate([
    (0, common_1.Injectable)()
], HierarchyExcelProvider);
exports.HierarchyExcelProvider = HierarchyExcelProvider;
//# sourceMappingURL=HierarchyExcelProvider.js.map