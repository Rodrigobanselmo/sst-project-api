"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskMap = void 0;
const client_1 = require("@prisma/client");
exports.riskMap = {
    [client_1.RiskFactorsEnum.FIS]: {
        label: 'Físico',
        order: 1,
    },
    [client_1.RiskFactorsEnum.QUI]: {
        label: 'Químico',
        order: 2,
    },
    [client_1.RiskFactorsEnum.BIO]: {
        label: 'Biológico',
        order: 3,
    },
    [client_1.RiskFactorsEnum.ERG]: {
        label: 'Ergonômico',
        order: 4,
    },
    [client_1.RiskFactorsEnum.ACI]: {
        label: 'Acidente',
        order: 5,
    },
};
//# sourceMappingURL=risks.constant.js.map