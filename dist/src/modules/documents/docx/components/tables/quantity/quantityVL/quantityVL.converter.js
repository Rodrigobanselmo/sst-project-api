"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVLConverter = void 0;
const client_1 = require("@prisma/client");
const origin_risk_1 = require("../../../../../../../shared/constants/maps/origin-risk");
const palette_1 = require("../../../../../../../shared/constants/palette");
const matriz_1 = require("../../../../../../../shared/utils/matriz");
const data_sort_1 = require("../../../../../../../shared/utils/sorts/data.sort");
const risk_data_json_types_1 = require("../../../../../../company/interfaces/risk-data-json.types");
const styles_1 = require("../../../../base/config/styles");
const quantityVL_constant_1 = require("./quantityVL.constant");
const quantityVLConverter = (riskGroupData, hierarchyTree) => {
    const rows = [];
    riskGroupData.data
        .filter((row) => {
        if (!row.json || !row.isQuantity)
            return false;
        const json = row.json;
        if (json.type !== risk_data_json_types_1.QuantityTypeEnum.VL)
            return false;
        return !!json.aren;
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
        const json = riskData.json;
        const aren = json.aren;
        const roAren = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probAren);
        cells[quantityVL_constant_1.QuantityVLColumnEnum.ORIGIN] = {
            text: origin || '',
            shading: { fill: palette_1.palette.table.header.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
        };
        cells[quantityVL_constant_1.QuantityVLColumnEnum.AREN] = {
            text: String(aren) || '-',
            shading: { fill: palette_1.palette.table.row.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
        };
        cells[quantityVL_constant_1.QuantityVLColumnEnum.RO_AREN] = {
            text: roAren.table || '-',
            shading: { fill: palette_1.palette.table.rowDark.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                left: { size: 15 },
            }),
        };
        rows.push(cells);
    });
    return rows;
};
exports.quantityVLConverter = quantityVLConverter;
//# sourceMappingURL=quantityVL.converter.js.map