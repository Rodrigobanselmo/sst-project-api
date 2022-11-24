"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityRadTableSection = void 0;
const docx_1 = require("docx");
const quantityRad_table_1 = require("./quantityRad.table");
const quantityRadTableSection = (riskGroupData, hierarchyTree) => {
    const table = (0, quantityRad_table_1.quantityRadTable)(riskGroupData, hierarchyTree);
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
exports.quantityRadTableSection = quantityRadTableSection;
//# sourceMappingURL=quantityRad.section.js.map