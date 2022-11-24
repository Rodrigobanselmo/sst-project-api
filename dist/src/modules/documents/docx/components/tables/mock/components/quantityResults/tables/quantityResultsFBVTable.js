"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityResultsFBVTable = void 0;
const docx_1 = require("docx");
const body_1 = require("../../../elements/body");
const header_1 = require("../../../elements/header");
const bodyC6_converter_1 = require("../bodyC6.converter");
const bodyFBV_1 = require("../data/bodyFBV");
const headerFBV_1 = require("../data/headerFBV");
const headerC5_converter_1 = require("../headerC5.converter");
const quantityResultsFBVTable = () => {
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow((0, headerC5_converter_1.NewHeaderC5)(headerFBV_1.headerFBV).map(tableHeaderElements.headerCell), {
                height: { value: 550, rule: docx_1.HeightRule.EXACT },
            }),
            ...(0, bodyC6_converter_1.NewBodyC6)(bodyFBV_1.rowBodyFullBodyVibration).map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
                height: { value: 550, rule: docx_1.HeightRule.ATLEAST },
            })),
        ],
    });
    return table;
};
exports.quantityResultsFBVTable = quantityResultsFBVTable;
//# sourceMappingURL=quantityResultsFBVTable.js.map