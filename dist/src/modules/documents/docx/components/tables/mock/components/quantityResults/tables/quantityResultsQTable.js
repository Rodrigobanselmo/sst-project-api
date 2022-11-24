"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityResultsQTable = void 0;
const docx_1 = require("docx");
const body_1 = require("../../../elements/body");
const header_1 = require("../../../elements/header");
const body_converter_1 = require("../body.converter");
const bodyQ_1 = require("../data/bodyQ");
const headerQR_1 = require("../data/headerQR");
const header_converter_1 = require("../header.converter");
const quantityResultsQTable = () => {
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow((0, header_converter_1.NewHeader)(headerQR_1.headerQR).map(tableHeaderElements.headerCell), {
                height: { value: 550, rule: docx_1.HeightRule.EXACT },
            }),
            ...(0, body_converter_1.NewBody)(bodyQ_1.rowBodyQui).map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
                height: { value: 550, rule: docx_1.HeightRule.ATLEAST },
            })),
        ],
    });
    return table;
};
exports.quantityResultsQTable = quantityResultsQTable;
//# sourceMappingURL=quantityResultsQTable.js.map