"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.annualDoseTable = void 0;
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const body_converter_1 = require("./body.converter");
const header_converter_1 = require("./header.converter");
const annualDoseTable = () => {
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow((0, header_converter_1.NewTopHeader)().map(tableHeaderElements.headerCell), {
                height: { value: 300, rule: docx_1.HeightRule.ATLEAST },
            }),
            tableHeaderElements.headerRow((0, header_converter_1.NewHeader)().map(tableHeaderElements.headerCell), {
                height: { value: 350, rule: docx_1.HeightRule.ATLEAST },
            }),
            ...(0, body_converter_1.NewBody)().map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
                height: { value: 350, rule: docx_1.HeightRule.ATLEAST },
            })),
        ],
    });
    return table;
};
exports.annualDoseTable = annualDoseTable;
//# sourceMappingURL=table.component.js.map