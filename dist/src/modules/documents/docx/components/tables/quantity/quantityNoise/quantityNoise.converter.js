"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityNoiseConverter = void 0;
const client_1 = require("@prisma/client");
const palette_1 = require("../../../../../../../shared/constants/palette");
const data_sort_1 = require("../../../../../../../shared/utils/sorts/data.sort");
const origin_risk_1 = require("./../../../../../../../shared/constants/maps/origin-risk");
const matriz_1 = require("./../../../../../../../shared/utils/matriz");
const styles_1 = require("./../../../../base/config/styles");
const risk_data_json_types_1 = require("./../../../../../../company/interfaces/risk-data-json.types");
const quantityNoise_constant_1 = require("./quantityNoise.constant");
const quantityNoiseConverter = (riskGroupData, hierarchyTree) => {
    const rows = [];
    riskGroupData.data
        .filter((row) => {
        if (!row.json || !row.isQuantity)
            return false;
        const json = row.json;
        if (json.type !== risk_data_json_types_1.QuantityTypeEnum.NOISE)
            return false;
        if (!riskGroupData.isQ5) {
            return !!json.ltcatq3;
        }
        if (riskGroupData.isQ5) {
            return !!json.ltcatq5 || !!json.nr15q5;
        }
    })
        .sort((a, b) => (0, data_sort_1.sortData)(a.homogeneousGroup, b.homogeneousGroup, 'name'))
        .map((riskData) => {
        const cells = [];
        const json = riskData.json;
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
        const value = riskGroupData.isQ5 ? String(Math.max(Number((json === null || json === void 0 ? void 0 : json.ltcatq5) || 0), Number((json === null || json === void 0 ? void 0 : json.nr15q5) || 0))) : json.ltcatq3;
        const ro = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability);
        cells[quantityNoise_constant_1.QuantityNoiseColumnEnum.ORIGIN] = {
            text: origin || '',
            shading: { fill: palette_1.palette.table.rowDark.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
        };
        cells[quantityNoise_constant_1.QuantityNoiseColumnEnum.DB] = {
            text: value || '',
            shading: { fill: palette_1.palette.table.rowDark.string },
        };
        cells[quantityNoise_constant_1.QuantityNoiseColumnEnum.RO] = {
            text: ro.table || '',
            shading: { fill: palette_1.palette.table.header.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                left: { size: 15 },
            }),
        };
        rows.push(cells);
    });
    return rows;
};
exports.quantityNoiseConverter = quantityNoiseConverter;
//# sourceMappingURL=quantityNoise.converter.js.map