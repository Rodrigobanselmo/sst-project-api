"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityNoiseTableSection = void 0;
const docx_1 = require("docx");
const quantityNoise_table_1 = require("./quantityNoise.table");
const quantityNoiseTableSection = (riskGroupData, hierarchyTree) => {
    const table = (0, quantityNoise_table_1.quantityNoiseTable)(riskGroupData, hierarchyTree);
    const section = {
        children: [table],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: docx_1.PageOrientation.LANDSCAPE },
            },
        },
    };
    return section;
};
exports.quantityNoiseTableSection = quantityNoiseTableSection;
//# sourceMappingURL=quantityNoise.section.js.map