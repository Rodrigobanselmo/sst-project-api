"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatrizRisk = void 0;
const matrizRisk_constant_1 = require("../../modules/documents/constants/matrizRisk.constant");
const getMatrizRisk = (severity, probability) => {
    if (!severity || !probability)
        return matrizRisk_constant_1.matrixRiskMap[0];
    if (probability >= 6)
        return matrizRisk_constant_1.matrixRiskMap[6];
    const value = matrizRisk_constant_1.matrixRisk[5 - probability][severity - 1];
    return matrizRisk_constant_1.matrixRiskMap[value || 1];
};
exports.getMatrizRisk = getMatrizRisk;
//# sourceMappingURL=matriz.js.map