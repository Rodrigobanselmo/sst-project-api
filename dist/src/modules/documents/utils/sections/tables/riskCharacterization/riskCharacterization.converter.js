"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskCharacterizationConverter = void 0;
const risk_enums_1 = require("../../../../../../shared/constants/enum/risk.enums");
const palette_1 = require("../../../../../../shared/constants/palette");
const number_sort_1 = require("../../../../../../shared/utils/sorts/number.sort");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const riskCharacterization_constant_1 = require("./riskCharacterization.constant");
const riskCharacterizationConverter = (riskGroup) => {
    const riskMap = {};
    riskGroup.data.forEach((riskData) => {
        const cells = [];
        if (riskMap[riskData.riskId])
            return;
        const risk = riskData.riskFactor;
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.AGENT] = { text: risk.name || 'NA', size: 4, type: risk.type, shading: { fill: palette_1.palette.table.header.string } };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.CAS] = { text: risk.cas || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.PROPAGATION] = { text: (risk.propagation || []).join('\n') || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.UNIT] = { text: risk.unit || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.NR15LT] = { text: risk.nr15lt || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.ACGIH_TWA] = { text: risk.twa || 'NA', size: 3 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.ACGIH_STEL] = { text: risk.stel || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.IPVS] = { text: risk.ipvs || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.PV] = { text: risk.pv || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.PE] = { text: risk.pe || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.CARNOGENICITY_ACGIH] = { text: risk.carnogenicityACGIH || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.CARNOGENICITY_LINACH] = { text: risk.carnogenicityLinach || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.BEI] = { text: risk.exame || 'NA', size: 2 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.SEVERITY] = { text: String(risk.severity || '-'), size: 1, shading: { fill: palette_1.palette.table.header.string } };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.SYMPTOMS] = { text: risk.symptoms || ' ', size: 4 };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.EFFECT_BODY] = { text: risk.risk || ' ', size: 4 };
        riskMap[riskData.riskId] = cells;
    });
    const bodyData = Object.values(riskMap)
        .sort(([a], [b]) => (0, string_sort_1.sortString)(a, b, 'text'))
        .sort(([a], [b]) => (0, number_sort_1.sortNumber)(risk_enums_1.RiskOrderEnum[a.type], risk_enums_1.RiskOrderEnum[b.type])).map((bodyRow, index) => bodyRow.map((cell) => (Object.assign(Object.assign({}, cell), { darker: index % 2 != 0 }))));
    return bodyData;
};
exports.riskCharacterizationConverter = riskCharacterizationConverter;
//# sourceMappingURL=riskCharacterization.converter.js.map