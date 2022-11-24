"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityQuiConverter = void 0;
const client_1 = require("@prisma/client");
const origin_risk_1 = require("../../../../../../../shared/constants/maps/origin-risk");
const palette_1 = require("../../../../../../../shared/constants/palette");
const matriz_1 = require("../../../../../../../shared/utils/matriz");
const data_sort_1 = require("../../../../../../../shared/utils/sorts/data.sort");
const risk_data_json_types_1 = require("../../../../../../company/interfaces/risk-data-json.types");
const styles_1 = require("../../../../base/config/styles");
const quantityQui_constant_1 = require("./quantityQui.constant");
const quantityQuiConverter = (riskGroupData, hierarchyTree) => {
    const rows = [];
    riskGroupData.data
        .filter((row) => {
        if (!row.json || !row.isQuantity)
            return false;
        const json = row.json;
        if (json.type !== risk_data_json_types_1.QuantityTypeEnum.QUI)
            return false;
        return !!json.nr15ltProb || !!json.stelProb || !!json.twaProb;
    })
        .sort((a, b) => (0, data_sort_1.sortData)(a.homogeneousGroup, b.homogeneousGroup, 'name'))
        .map((riskData) => {
        let origin;
        if (riskData.homogeneousGroup.environment)
            origin = `${riskData.homogeneousGroup.environment.name}\n(${origin_risk_1.originRiskMap[riskData.homogeneousGroup.environment.type].name})`;
        if (riskData.homogeneousGroup.characterization)
            origin = `${riskData.homogeneousGroup.characterization.name}\n(${origin_risk_1.originRiskMap[riskData.homogeneousGroup.characterization.type].name})`;
        if (!riskData.homogeneousGroup.type)
            origin = `${riskData.homogeneousGroup.name}\n(GSE)`;
        if (riskData.homogeneousGroup.type == client_1.HomoTypeEnum.HIERARCHY) {
            const hierarchy = hierarchyTree[riskData.homogeneousGroup.id];
            if (hierarchy)
                origin = `${hierarchy.name}\n(${origin_risk_1.originRiskMap[hierarchy.type].name})`;
        }
        const json = riskData.json;
        const array = [
            {
                result: json.nr15ltValue,
                leo: json.nr15lt,
                prob: json.nr15ltProb,
                type: json.isNr15Teto ? 'NR-15 LT TETO' : 'NR-15 LT',
            },
            {
                result: json.stelValue,
                leo: json.stel,
                prob: json.stelProb,
                type: json.isStelTeto ? 'ACGIH C' : 'ACGIH TLV-STEL',
            },
            {
                result: json.twaValue,
                leo: json.twa,
                prob: json.twaProb,
                type: json.isTwaTeto ? 'ACGIH C' : 'ACGIH TLV-TWA',
            },
            {
                result: json.vmpValue,
                leo: json.vmp,
                prob: json.vmpProb,
                type: json.isVmpTeto ? 'NR-15 LT TETO' : 'NR-15 VMP',
            },
        ];
        array.forEach((item) => {
            const cells = [];
            if (!(item === null || item === void 0 ? void 0 : item.result) || !(item === null || item === void 0 ? void 0 : item.leo) || !item.prob)
                return;
            const ro = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, item.prob);
            const ij = Number(item.result.replace(/[^0-9.]/g, '')) / Number(item.leo.replace(/[^0-9.]/g, ''));
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.ORIGIN] = {
                text: origin || '',
                shading: { fill: palette_1.palette.table.header.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                    right: { size: 15 },
                }),
            };
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.CHEMICAL] = {
                text: String(riskData.riskFactor.name) || '-',
                shading: { fill: palette_1.palette.table.row.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
            };
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.TYPE] = {
                text: String(item.type) || '-',
                shading: { fill: palette_1.palette.table.row.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
            };
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.UNIT] = {
                text: String(riskData.riskFactor.unit || json.unit) || '-',
                shading: { fill: palette_1.palette.table.row.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
            };
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.RESULT] = {
                text: String(item.result) || '-',
                shading: { fill: palette_1.palette.table.row.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
            };
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.LEO] = {
                text: String(item.leo) || '-',
                shading: { fill: palette_1.palette.table.row.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
            };
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.IJ] = {
                text: String(ij.toFixed(5)) || '-',
                shading: { fill: palette_1.palette.table.row.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
            };
            cells[quantityQui_constant_1.QuantityQuiColumnEnum.RO] = {
                text: ro.table || '-',
                shading: { fill: palette_1.palette.table.rowDark.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                    left: { size: 15 },
                }),
            };
            rows.push(cells);
        });
    });
    return rows;
};
exports.quantityQuiConverter = quantityQuiConverter;
//# sourceMappingURL=quantityQui.converter.js.map