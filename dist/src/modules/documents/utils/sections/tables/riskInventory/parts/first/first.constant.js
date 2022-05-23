"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyMap = exports.firstRiskInventoryHeader = exports.FirstRiskInventoryColumnEnum = void 0;
const client_1 = require("@prisma/client");
var FirstRiskInventoryColumnEnum;
(function (FirstRiskInventoryColumnEnum) {
    FirstRiskInventoryColumnEnum[FirstRiskInventoryColumnEnum["SOURCE"] = 0] = "SOURCE";
    FirstRiskInventoryColumnEnum[FirstRiskInventoryColumnEnum["REVIEW"] = 1] = "REVIEW";
    FirstRiskInventoryColumnEnum[FirstRiskInventoryColumnEnum["ELABORATION_BY"] = 2] = "ELABORATION_BY";
    FirstRiskInventoryColumnEnum[FirstRiskInventoryColumnEnum["APPROVE_BY"] = 3] = "APPROVE_BY";
    FirstRiskInventoryColumnEnum[FirstRiskInventoryColumnEnum["DATA"] = 4] = "DATA";
    FirstRiskInventoryColumnEnum[FirstRiskInventoryColumnEnum["UNIT"] = 5] = "UNIT";
})(FirstRiskInventoryColumnEnum = exports.FirstRiskInventoryColumnEnum || (exports.FirstRiskInventoryColumnEnum = {}));
const RewRiskInventoryHeader = () => {
    const header = [];
    header[FirstRiskInventoryColumnEnum.SOURCE] = { text: 'Fonte:', bold: true };
    header[FirstRiskInventoryColumnEnum.REVIEW] = { text: 'Revisão:', bold: true };
    header[FirstRiskInventoryColumnEnum.ELABORATION_BY] = { text: 'Elaborador:', bold: true };
    header[FirstRiskInventoryColumnEnum.APPROVE_BY] = { text: 'Aprovação:', bold: true };
    header[FirstRiskInventoryColumnEnum.DATA] = { text: 'Data:', bold: true };
    header[FirstRiskInventoryColumnEnum.UNIT] = { text: 'Unidade:', bold: true };
    return header;
};
exports.firstRiskInventoryHeader = RewRiskInventoryHeader();
exports.hierarchyMap = {
    [client_1.HierarchyEnum.DIRECTORY]: { text: 'DIRETORIA:', index: 0 },
    [client_1.HierarchyEnum.MANAGEMENT]: { text: 'Gerência:', index: 1 },
    [client_1.HierarchyEnum.SECTOR]: { text: 'Setor:', index: 2 },
    [client_1.HierarchyEnum.SUB_SECTOR]: { text: 'Subsetor (Posto de Trabalho):', index: 3 },
    [client_1.HierarchyEnum.OFFICE]: { text: 'Cargo:', index: 4 },
    [client_1.HierarchyEnum.SUB_OFFICE]: { text: 'Cardo Desenvolvido:', index: 5 },
};
//# sourceMappingURL=first.constant.js.map