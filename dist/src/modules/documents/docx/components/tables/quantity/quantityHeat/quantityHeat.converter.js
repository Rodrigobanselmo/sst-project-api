"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityHeatConverter = void 0;
const client_1 = require("@prisma/client");
const origin_risk_1 = require("../../../../../../../shared/constants/maps/origin-risk");
const palette_1 = require("../../../../../../../shared/constants/palette");
const matriz_1 = require("../../../../../../../shared/utils/matriz");
const data_sort_1 = require("../../../../../../../shared/utils/sorts/data.sort");
const risk_data_json_types_1 = require("../../../../../../company/interfaces/risk-data-json.types");
const styles_1 = require("../../../../base/config/styles");
const quantityHeat_constant_1 = require("./quantityHeat.constant");
const quantityHeatConverter = (riskGroupData, hierarchyTree) => {
    const rows = [];
    riskGroupData.data
        .filter((row) => {
        if (!row.json || !row.isQuantity)
            return false;
        const json = row.json;
        if (json.type !== risk_data_json_types_1.QuantityTypeEnum.HEAT)
            return false;
        return !!row.ibtug && !!row.ibtugLEO;
    })
        .sort((a, b) => (0, data_sort_1.sortData)(a.homogeneousGroup, b.homogeneousGroup, 'name'))
        .map((riskData) => {
        const cells = [];
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
        const value = riskData.ibtug;
        const limit = riskData.ibtugLEO;
        const ro = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability);
        cells[quantityHeat_constant_1.QuantityHeatColumnEnum.ORIGIN] = {
            text: origin || '',
            shading: { fill: palette_1.palette.table.rowDark.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
        };
        cells[quantityHeat_constant_1.QuantityHeatColumnEnum.IBTUG] = {
            text: String(value) || '',
            shading: { fill: palette_1.palette.table.rowDark.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
        };
        cells[quantityHeat_constant_1.QuantityHeatColumnEnum.LT] = {
            text: String(limit) || '',
            shading: { fill: palette_1.palette.table.rowDark.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
        };
        cells[quantityHeat_constant_1.QuantityHeatColumnEnum.RO] = {
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
exports.quantityHeatConverter = quantityHeatConverter;
//# sourceMappingURL=quantityHeat.converter.js.map