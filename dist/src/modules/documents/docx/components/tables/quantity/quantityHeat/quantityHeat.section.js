"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityHeatTableSection = void 0;
const docx_1 = require("docx");
const quantityHeat_table_1 = require("./quantityHeat.table");
const quantityHeatTableSection = (riskGroupData, hierarchyTree) => {
    const table = (0, quantityHeat_table_1.quantityHeatTable)(riskGroupData, hierarchyTree);
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
exports.quantityHeatTableSection = quantityHeatTableSection;
//# sourceMappingURL=quantityHeat.section.js.map