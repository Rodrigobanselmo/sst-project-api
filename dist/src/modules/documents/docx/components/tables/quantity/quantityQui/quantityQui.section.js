"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityQuiTableSection = void 0;
const docx_1 = require("docx");
const quantityQui_table_1 = require("./quantityQui.table");
const quantityQuiTableSection = (riskGroupData, hierarchyTree) => {
    const table = (0, quantityQui_table_1.quantityQuiTable)(riskGroupData, hierarchyTree);
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
exports.quantityQuiTableSection = quantityQuiTableSection;
//# sourceMappingURL=quantityQui.section.js.map