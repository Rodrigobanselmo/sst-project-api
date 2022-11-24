"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataConverter = void 0;
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const origin_risk_1 = require("./../../../../../../../../shared/constants/maps/origin-risk");
const dataConverter = (hierarchyData) => {
    return [
        {
            text: (hierarchyData.hierarchies || []).map((h) => `${h.name} (${origin_risk_1.originRiskMap[h.type].name})`).join(', '),
            alignment: docx_1.AlignmentType.CENTER,
            borders: body_1.borderNoneStyle,
        },
    ];
};
exports.dataConverter = dataConverter;
//# sourceMappingURL=offices.converter.js.map