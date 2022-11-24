"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskCharacterizationConverter = void 0;
const risk_enums_1 = require("../../../../../../shared/constants/enum/risk.enums");
const palette_1 = require("../../../../../../shared/constants/palette");
const number_sort_1 = require("../../../../../../shared/utils/sorts/number.sort");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const styles_1 = require("../../../base/config/styles");
const riskCharacterization_constant_1 = require("./riskCharacterization.constant");
const riskCharacterizationConverter = (riskGroup) => {
    const riskMap = {};
    riskGroup.data.forEach((riskData) => {
        const cells = [];
        if (riskMap[riskData.riskId])
            return;
        const risk = riskData.riskFactor;
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.AGENT] = {
            text: risk.name || '--',
            size: 4,
            type: risk.type,
            shading: { fill: palette_1.palette.table.header.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.CAS] = {
            text: risk.cas || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.PROPAGATION] = {
            text: (risk.propagation || []).join('\n') || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.UNIT] = {
            text: risk.unit || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.NR15LT] = {
            text: risk.nr15lt || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.ACGIH_TWA] = {
            text: risk.twa || '--',
            size: 3,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.ACGIH_STEL] = {
            text: risk.stel || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.IPVS] = {
            text: risk.ipvs || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.PV] = {
            text: risk.pv || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.PE] = {
            text: risk.pe || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.CARNOGENICITY_ACGIH] = {
            text: risk.carnogenicityACGIH || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.CARNOGENICITY_LINACH] = {
            text: risk.carnogenicityLinach || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.BEI] = {
            text: risk.exame || '--',
            size: 2,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.SEVERITY] = {
            text: String(risk.severity || '-'),
            size: 1,
            shading: {
                fill: palette_1.palette.table.header.string,
            },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.SYMPTOMS] = {
            text: risk.symptoms || ' ',
            size: 4,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[riskCharacterization_constant_1.RiskCharacterizationColumnEnum.EFFECT_BODY] = {
            text: risk.risk || ' ',
            size: 4,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        riskMap[riskData.riskId] = cells;
    });
    const bodyData = Object.values(riskMap)
        .sort(([a], [b]) => (0, string_sort_1.sortString)(a, b, 'text'))
        .sort(([a], [b]) => (0, number_sort_1.sortNumber)(risk_enums_1.RiskOrderEnum[a.type], risk_enums_1.RiskOrderEnum[b.type]))
        .map((bodyRow, index) => bodyRow.map((cell) => (Object.assign(Object.assign({}, cell), { darker: index % 2 != 0 }))));
    return bodyData;
};
exports.riskCharacterizationConverter = riskCharacterizationConverter;
//# sourceMappingURL=riskCharacterization.converter.js.map