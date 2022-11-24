"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVFBTableSection = void 0;
const docx_1 = require("docx");
const quantityVFB_table_1 = require("./quantityVFB.table");
const quantityVFBTableSection = (riskGroupData, hierarchyTree) => {
    const table = (0, quantityVFB_table_1.quantityVFBTable)(riskGroupData, hierarchyTree);
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
exports.quantityVFBTableSection = quantityVFBTableSection;
//# sourceMappingURL=quantityVFB.section.js.map