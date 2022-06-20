"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskMap = void 0;
const client_1 = require("@prisma/client");
exports.riskMap = {
    [client_1.RiskFactorsEnum.FIS]: {
        label: 'Físico',
    },
    [client_1.RiskFactorsEnum.QUI]: {
        label: 'Químico',
    },
    [client_1.RiskFactorsEnum.BIO]: {
        label: 'Biológico',
    },
    [client_1.RiskFactorsEnum.ACI]: {
        label: 'Acidente',
    },
    [client_1.RiskFactorsEnum.ERG]: {
        label: 'Ergonômico',
    },
};
//# sourceMappingURL=risks.constant.js.map