"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVFBConverter = void 0;
const client_1 = require("@prisma/client");
const origin_risk_1 = require("../../../../../../../shared/constants/maps/origin-risk");
const palette_1 = require("../../../../../../../shared/constants/palette");
const matriz_1 = require("../../../../../../../shared/utils/matriz");
const data_sort_1 = require("../../../../../../../shared/utils/sorts/data.sort");
const risk_data_json_types_1 = require("../../../../../../company/interfaces/risk-data-json.types");
const styles_1 = require("../../../../base/config/styles");
const quantityVFB_constant_1 = require("./quantityVFB.constant");
const quantityVFBConverter = (riskGroupData, hierarchyTree) => {
    const rows = [];
    riskGroupData.data
        .filter((row) => {
        if (!row.json || !row.isQuantity)
            return false;
        const json = row.json;
        if (json.type !== risk_data_json_types_1.QuantityTypeEnum.VFB)
            return false;
        return !!json.aren || !!json.vdvr;
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
        const vdvr = json.vdvr;
        const roAren = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probAren);
        const roVdvr = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probVdvr);
        cells[quantityVFB_constant_1.QuantityVFBColumnEnum.ORIGIN] = {
            text: origin || '',
            shading: { fill: palette_1.palette.table.header.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
        };
        cells[quantityVFB_constant_1.QuantityVFBColumnEnum.AREN] = {
            text: String(aren) || '-',
            shading: { fill: palette_1.palette.table.row.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
        };
        cells[quantityVFB_constant_1.QuantityVFBColumnEnum.RO_AREN] = {
            text: roAren.table || '-',
            shading: { fill: palette_1.palette.table.rowDark.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
        };
        cells[quantityVFB_constant_1.QuantityVFBColumnEnum.VDVR] = {
            text: String(vdvr) || '-',
            shading: { fill: palette_1.palette.table.row.string },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
        };
        cells[quantityVFB_constant_1.QuantityVFBColumnEnum.RO_VDVR] = {
            text: roVdvr.table || '-',
            shading: { fill: palette_1.palette.table.rowDark.string },
        };
        rows.push(cells);
    });
    return rows;
};
exports.quantityVFBConverter = quantityVFBConverter;
//# sourceMappingURL=quantityVFB.converter.js.map