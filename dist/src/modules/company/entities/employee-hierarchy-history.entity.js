"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRules = exports.EmployeeHierarchyHistoryEntity = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const hierarchy_entity_1 = require("./hierarchy.entity");
class EmployeeHierarchyHistoryEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial === null || partial === void 0 ? void 0 : partial.hierarchy) {
            this.hierarchy = new hierarchy_entity_1.HierarchyEntity(partial.hierarchy);
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, motive: { required: true, type: () => Object }, startDate: { required: true, type: () => Date }, hierarchyId: { required: true, type: () => String }, employeeId: { required: true, type: () => Number }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, directory: { required: false, type: () => String }, management: { required: false, type: () => String }, sector: { required: false, type: () => String }, office: { required: false, type: () => String }, deletedAt: { required: true, type: () => Date }, employee: { required: false, type: () => require("./employee.entity").EmployeeEntity }, hierarchy: { required: false, type: () => require("./hierarchy.entity").HierarchyEntity }, subHierarchies: { required: false, type: () => [Object] } };
    }
}
exports.EmployeeHierarchyHistoryEntity = EmployeeHierarchyHistoryEntity;
const base = [
    client_1.EmployeeHierarchyMotiveTypeEnum.ALOC,
    client_1.EmployeeHierarchyMotiveTypeEnum.PROM,
    client_1.EmployeeHierarchyMotiveTypeEnum.TRANS,
    client_1.EmployeeHierarchyMotiveTypeEnum.TRANS_PROM,
];
const adm = client_1.EmployeeHierarchyMotiveTypeEnum.ADM;
const dem = client_1.EmployeeHierarchyMotiveTypeEnum.DEM;
exports.historyRules = {
    [client_1.EmployeeHierarchyMotiveTypeEnum.ADM]: {
        before: [null, dem],
        after: [...base, dem, null],
        canHaveHierarchy: false,
    },
    [client_1.EmployeeHierarchyMotiveTypeEnum.TRANS]: {
        before: [...base, adm],
        after: [...base, dem, null],
        canHaveHierarchy: true,
    },
    [client_1.EmployeeHierarchyMotiveTypeEnum.PROM]: {
        before: [...base, adm],
        after: [...base, dem, null],
        canHaveHierarchy: true,
    },
    [client_1.EmployeeHierarchyMotiveTypeEnum.ALOC]: {
        before: [...base, adm],
        after: [...base, dem, null],
        canHaveHierarchy: true,
    },
    [client_1.EmployeeHierarchyMotiveTypeEnum.TRANS_PROM]: {
        before: [...base, adm],
        after: [...base, dem, null],
        canHaveHierarchy: true,
    },
    [client_1.EmployeeHierarchyMotiveTypeEnum.DEM]: {
        before: [...base, adm],
        after: [adm, null],
        canHaveHierarchy: true,
    },
    ['null']: {
        before: [...base, adm, dem, null],
        after: [adm, null],
        canHaveHierarchy: true,
    },
};
//# sourceMappingURL=employee-hierarchy-history.entity.js.map