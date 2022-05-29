"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatrizRisk = void 0;
const matrizRisk_constant_1 = require("../constants/matrizRisk.constant");
const getMatrizRisk = (severity, probability) => {
    if (!severity || !probability)
        return null;
    const value = matrizRisk_constant_1.matrixRisk[5 - probability][severity - 1];
    return matrizRisk_constant_1.matrixRiskMap[value || 1];
};
exports.getMatrizRisk = getMatrizRisk;
//# sourceMappingURL=matriz.js.map