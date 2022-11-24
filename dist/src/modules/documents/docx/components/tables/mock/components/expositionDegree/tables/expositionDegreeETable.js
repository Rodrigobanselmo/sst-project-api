"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expositionDegreeETable = void 0;
const docx_1 = require("docx");
const body_1 = require("../../../elements/body");
const header_1 = require("../../../elements/header");
const body_simple_converter_1 = require("../body-simple.converter");
const bodyE_1 = require("../data/bodyE");
const header_converter_1 = require("../header.converter");
const expositionDegreeETable = () => {
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(header_converter_1.headerConverter.map(tableHeaderElements.headerCell), {
                height: { value: 550, rule: docx_1.HeightRule.EXACT },
            }),
            ...(0, body_simple_converter_1.NewBodySimple)(bodyE_1.rowBodyErg).map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
                height: { value: 700, rule: docx_1.HeightRule.ATLEAST },
            })),
        ],
    });
    return table;
};
exports.expositionDegreeETable = expositionDegreeETable;
//# sourceMappingURL=expositionDegreeETable.js.map