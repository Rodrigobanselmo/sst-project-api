"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataConverter = void 0;
const docx_1 = require("docx");
const risks_constant_1 = require("../../../../../../../../modules/documents/constants/risks.constant");
const matriz_1 = require("../../../../../../../../modules/documents/utils/matriz");
const palette_1 = require("../../../../../../../../shared/constants/palette");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const third_constant_1 = require("./third.constant");
const dataConverter = (riskGroup, hierarchyData) => {
    const riskFactorsMap = new Map();
    const riskInventoryData = [];
    riskGroup.data.forEach((riskData) => {
        var _a;
        if (!hierarchyData.org.some((org) => org.homogeneousGroupIds.includes(riskData.homogeneousGroupId)))
            return;
        const cells = [];
        const base = { borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder, top: header_1.whiteColumnBorder }), margins: { top: 50, bottom: 50 }, alignment: docx_1.AlignmentType.CENTER };
        const attention = { color: palette_1.palette.text.attention.string, bold: true };
        const fill = { shading: { fill: palette_1.palette.table.header.string } };
        const riskOccupational = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability);
        const riskOccupationalAfter = (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.TYPE] = Object.assign(Object.assign({ text: ((_a = risks_constant_1.riskMap[riskData.riskFactor.type]) === null || _a === void 0 ? void 0 : _a.label) || '', bold: true, size: 4 }, base), fill);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.RISK_FACTOR] = Object.assign({ text: riskData.riskFactor.name, size: 10 }, base);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.RISK] = Object.assign({ text: riskData.riskFactor.risk, size: 7 }, base);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.SOURCE] = Object.assign({ text: riskData.generateSources.map((gs) => gs.name).join('\n'), size: 10 }, base);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.EPI] = Object.assign({ text: riskData.epis.map((epi) => `${epi.equipment} CA: ${epi.ca}`).join('\n'), size: 7 }, base);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.ENG] = Object.assign({ text: riskData.engs.map((eng) => eng.medName).join('\n'), size: 7 }, base);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.ADM] = Object.assign({ text: riskData.adms.map((adm) => adm.medName).join('\n'), size: 7 }, base);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.SEVERITY] = Object.assign(Object.assign({ text: String(riskData.riskFactor.severity), size: 1 }, base), fill);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.PROBABILITY] = Object.assign(Object.assign({ text: String(riskData.probability), size: 1 }, base), fill);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL] = Object.assign(Object.assign(Object.assign(Object.assign({ text: (riskOccupational === null || riskOccupational === void 0 ? void 0 : riskOccupational.label) || '' }, base), (riskOccupational.level > 3 ? attention : {})), { borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteBorder, top: header_1.whiteColumnBorder }), size: 3 }), fill);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.RECOMMENDATIONS] = Object.assign({ text: riskData.recs.map((rec) => rec.recName).join('\n'), size: 7 }, base);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = Object.assign(Object.assign({ text: String(riskData.riskFactor.severity), size: 1 }, base), fill);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = Object.assign(Object.assign({ text: String(riskData.probabilityAfter || riskData.probability), size: 1 }, base), fill);
        cells[third_constant_1.ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER] = Object.assign(Object.assign(Object.assign(Object.assign({ text: (riskOccupationalAfter === null || riskOccupationalAfter === void 0 ? void 0 : riskOccupationalAfter.label) || '' }, base), (riskOccupationalAfter.level > 3 ? attention : {})), { borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { top: header_1.whiteColumnBorder }), size: 3 }), fill);
        const rows = riskFactorsMap.get(riskData.riskFactor.type) || [];
        riskFactorsMap.set(riskData.riskFactor.type, [...rows, cells]);
    });
    riskFactorsMap.forEach((rows) => {
        riskInventoryData.push(...rows.map((cells) => {
            const clone = [...cells];
            return clone;
        }, []));
    });
    return riskInventoryData;
};
exports.dataConverter = dataConverter;
//# sourceMappingURL=third.converter.js.map