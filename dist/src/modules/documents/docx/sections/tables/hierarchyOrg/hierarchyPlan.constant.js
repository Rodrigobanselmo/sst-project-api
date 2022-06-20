"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyPlanMap = exports.HierarchyPlanColumnEnum = void 0;
const client_1 = require("@prisma/client");
var HierarchyPlanColumnEnum;
(function (HierarchyPlanColumnEnum) {
    HierarchyPlanColumnEnum["GSE"] = "GSE";
    HierarchyPlanColumnEnum["DESCRIPTION"] = "Description";
})(HierarchyPlanColumnEnum = exports.HierarchyPlanColumnEnum || (exports.HierarchyPlanColumnEnum = {}));
exports.HierarchyPlanMap = {
    [HierarchyPlanColumnEnum.GSE]: { text: 'GSE', size: 2 },
    [HierarchyPlanColumnEnum.DESCRIPTION]: { text: 'Características do GSE', size: 5 },
    [client_1.HierarchyEnum.DIRECTORY]: { text: 'DIRETORIA', size: 3, position: 0 },
    [client_1.HierarchyEnum.MANAGEMENT]: { text: 'GERÊNCIA', size: 3, position: 1 },
    [client_1.HierarchyEnum.SECTOR]: { text: 'SETOR', size: 3, position: 2 },
    [client_1.HierarchyEnum.SUB_SECTOR]: { text: 'SUB-SETOR', size: 3, position: 3 },
    [client_1.HierarchyEnum.OFFICE]: { text: 'CARGO', size: 3, position: 4 },
    [client_1.HierarchyEnum.SUB_OFFICE]: { text: 'CARGO DESENVOLVIDO', size: 3, position: 5 },
};
//# sourceMappingURL=hierarchyPlan.constant.js.map