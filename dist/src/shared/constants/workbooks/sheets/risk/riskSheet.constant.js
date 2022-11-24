"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskSheetConstant = void 0;
const client_1 = require("@prisma/client");
const aciColumns_constant_1 = require("./each/aciColumns.constant");
const bioColumns_constant_1 = require("./each/bioColumns.constant");
const ergColumns_constant_1 = require("./each/ergColumns.constant");
const fisColumns_constant_1 = require("./each/fisColumns.constant");
const quiColumns_constant_1 = require("./each/quiColumns.constant");
const riskColumns_constant_1 = require("./riskColumns.constant");
const riskSheet_enum_1 = require("./riskSheet.enum");
exports.riskSheetConstant = {
    [riskSheet_enum_1.RiskSheetEnum.PHYSICAL_RISK]: {
        name: 'Riscos físicos',
        type: client_1.RiskFactorsEnum.FIS,
        id: riskSheet_enum_1.RiskSheetEnum.PHYSICAL_RISK,
        columns: [...riskColumns_constant_1.riskColumnsConstant, ...fisColumns_constant_1.phyColumnsConstant],
    },
    [riskSheet_enum_1.RiskSheetEnum.CHEMICAL_RISK]: {
        name: 'Riscos químicos',
        type: client_1.RiskFactorsEnum.QUI,
        id: riskSheet_enum_1.RiskSheetEnum.CHEMICAL_RISK,
        columns: [...riskColumns_constant_1.riskColumnsConstant, ...quiColumns_constant_1.quiColumnsConstant],
    },
    [riskSheet_enum_1.RiskSheetEnum.BIOLOGICAL_RISK]: {
        name: 'Riscos bilógicos',
        type: client_1.RiskFactorsEnum.BIO,
        id: riskSheet_enum_1.RiskSheetEnum.BIOLOGICAL_RISK,
        columns: [...riskColumns_constant_1.riskColumnsConstant, ...bioColumns_constant_1.bioColumnsConstant],
    },
    [riskSheet_enum_1.RiskSheetEnum.ACCIDENT_RISK]: {
        name: 'Riscos de acidente',
        type: client_1.RiskFactorsEnum.ACI,
        id: riskSheet_enum_1.RiskSheetEnum.ACCIDENT_RISK,
        columns: [...riskColumns_constant_1.riskColumnsConstant, ...aciColumns_constant_1.aciColumnsConstant],
    },
    [riskSheet_enum_1.RiskSheetEnum.ERGONOMIC_RISK]: {
        name: 'Riscos ergonômicos',
        type: client_1.RiskFactorsEnum.ERG,
        id: riskSheet_enum_1.RiskSheetEnum.ERGONOMIC_RISK,
        columns: [...riskColumns_constant_1.riskColumnsConstant, ...ergColumns_constant_1.ergColumnsConstant],
    },
};
//# sourceMappingURL=riskSheet.constant.js.map