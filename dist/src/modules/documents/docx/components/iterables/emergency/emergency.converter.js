"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyConverter = void 0;
const emergencyConverter = (riskData) => {
    const risks = [];
    riskData.forEach((data) => {
        if ((data === null || data === void 0 ? void 0 : data.riskFactor) && data.riskFactor.isEmergency)
            risks.push(data === null || data === void 0 ? void 0 : data.riskFactor.name);
    });
    return risks;
};
exports.emergencyConverter = emergencyConverter;
//# sourceMappingURL=emergency.converter.js.map