"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVLTableSection = void 0;
const docx_1 = require("docx");
const quantityVL_table_1 = require("./quantityVL.table");
const quantityVLTableSection = (riskGroupData, hierarchyTree) => {
    const table = (0, quantityVL_table_1.quantityVLTable)(riskGroupData, hierarchyTree);
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
exports.quantityVLTableSection = quantityVLTableSection;
//# sourceMappingURL=quantityVL.section.js.map