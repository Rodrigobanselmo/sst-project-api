"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityRadConverter = void 0;
const client_1 = require("@prisma/client");
const origin_risk_1 = require("../../../../../../../shared/constants/maps/origin-risk");
const palette_1 = require("../../../../../../../shared/constants/palette");
const matriz_1 = require("../../../../../../../shared/utils/matriz");
const data_sort_1 = require("../../../../../../../shared/utils/sorts/data.sort");
const risk_data_json_types_1 = require("../../../../../../company/interfaces/risk-data-json.types");
const styles_1 = require("../../../../base/config/styles");
const quantityRad_constant_1 = require("./quantityRad.constant");
const quantityRadConverter = (riskGroupData, hierarchyTree) => {
    const rows = [];
    riskGroupData.data
        .filter((row) => {
        if (!row.json || !row.isQuantity)
            return false;
        const json = row.json;
        if (json.type !== risk_data_json_types_1.QuantityTypeEnum.RADIATION)
            return false;
        return Object.entries(json).some(([key, value]) => {
            return key.includes('dose') && value;
        });
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
                bodyPart: 'Corpo Inteiro',
                employee: json.doseFB,
                prob: json.doseFBProb,
                public: json.doseFBPublic,
                publicProb: json.doseFBPublicProb,
            },
            {
                bodyPart: 'Cristalino',
                employee: json.doseEye,
                prob: json.doseEyeProb,
                public: json.doseEyePublic,
                publicProb: json.doseEyePublicProb,
            },
            {
                bodyPart: 'Pele',
                employee: json.doseSkin,
                prob: json.doseSkinProb,
                public: json.doseSkinPublic,
                publicProb: json.doseSkinPublicProb,
            },
            {
                bodyPart: 'Mãos e pés',
                employee: json.doseHand,
                prob: json.doseHandProb,
            },
        ];
        array.forEach((value) => {
            const cells = [];
            if (typeof (value === null || value === void 0 ? void 0 : value.prob) === 'number' || typeof (value === null || value === void 0 ? void 0 : value.publicProb) === 'number') {
                const prob = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, value.prob);
                const publicProb = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, value.publicProb);
                cells[quantityRad_constant_1.QuantityRadColumnEnum.ORIGIN] = {
                    text: origin || '',
                    shading: { fill: palette_1.palette.table.header.string },
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                        right: { size: 15 },
                    }),
                };
                cells[quantityRad_constant_1.QuantityRadColumnEnum.BODY_PART] = {
                    text: value.bodyPart || '-',
                    shading: { fill: palette_1.palette.table.row.string },
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
                };
                cells[quantityRad_constant_1.QuantityRadColumnEnum.EMPLOYEE] = {
                    text: value.employee || '-',
                    shading: { fill: palette_1.palette.table.row.string },
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
                };
                cells[quantityRad_constant_1.QuantityRadColumnEnum.RO_EMPLOYEE] = {
                    text: value.prob && prob ? prob.table : '-',
                    shading: { fill: palette_1.palette.table.rowDark.string },
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                        right: { size: 15 },
                    }),
                };
                cells[quantityRad_constant_1.QuantityRadColumnEnum.CUSTOMER] = {
                    text: value.public || '-',
                    shading: { fill: palette_1.palette.table.row.string },
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
                };
                cells[quantityRad_constant_1.QuantityRadColumnEnum.RO_CUSTOMER] = {
                    text: value.publicProb && publicProb ? publicProb.table : '-',
                    shading: { fill: palette_1.palette.table.rowDark.string },
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
                };
                rows.push(cells);
            }
        });
    });
    return rows;
};
exports.quantityRadConverter = quantityRadConverter;
//# sourceMappingURL=quantityRad.converter.js.map