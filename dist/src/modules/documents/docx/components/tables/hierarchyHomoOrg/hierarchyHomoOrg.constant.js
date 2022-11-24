"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyPlanMap = exports.HierarchyPlanColumnEnum = void 0;
const client_1 = require("@prisma/client");
const palette_1 = require("../../../../../../shared/constants/palette");
const styles_1 = require("../../../base/config/styles");
var HierarchyPlanColumnEnum;
(function (HierarchyPlanColumnEnum) {
    HierarchyPlanColumnEnum["GSE"] = "GSE";
    HierarchyPlanColumnEnum["DESCRIPTION"] = "Description";
})(HierarchyPlanColumnEnum = exports.HierarchyPlanColumnEnum || (exports.HierarchyPlanColumnEnum = {}));
exports.HierarchyPlanMap = {
    [HierarchyPlanColumnEnum.GSE]: {
        text: 'GSE',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
    [HierarchyPlanColumnEnum.DESCRIPTION]: {
        text: 'Características do GSE',
        size: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
    [client_1.HierarchyEnum.DIRECTORY]: {
        text: 'DIRETORIA',
        size: 3,
        position: 0,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
    [client_1.HierarchyEnum.MANAGEMENT]: {
        text: 'GERÊNCIA',
        size: 3,
        position: 1,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
    [client_1.HierarchyEnum.SECTOR]: {
        text: 'SETOR',
        size: 3,
        position: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
    [client_1.HierarchyEnum.SUB_SECTOR]: {
        text: 'SUB-SETOR',
        size: 3,
        position: 3,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
    [client_1.HierarchyEnum.OFFICE]: {
        text: 'CARGO',
        size: 3,
        position: 4,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
    [client_1.HierarchyEnum.SUB_OFFICE]: {
        text: 'CARGO DESENVOLVIDO',
        size: 3,
        position: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    },
};
//# sourceMappingURL=hierarchyHomoOrg.constant.js.map