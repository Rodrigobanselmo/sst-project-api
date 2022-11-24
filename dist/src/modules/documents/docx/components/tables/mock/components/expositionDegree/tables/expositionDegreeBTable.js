"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expositionDegreeBTable = void 0;
const docx_1 = require("docx");
const body_1 = require("../../../elements/body");
const header_1 = require("../../../elements/header");
const body_simple_converter_1 = require("../body-simple.converter");
const bodyB_1 = require("../data/bodyB");
const header_converter_1 = require("../header.converter");
const expositionDegreeBTable = () => {
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(header_converter_1.headerConverter.map(tableHeaderElements.headerCell), {
                height: { value: 550, rule: docx_1.HeightRule.EXACT },
            }),
            ...(0, body_simple_converter_1.NewBodySimple)(bodyB_1.rowBodyBio).map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
                height: { value: 700, rule: docx_1.HeightRule.ATLEAST },
            })),
        ],
    });
    return table;
};
exports.expositionDegreeBTable = expositionDegreeBTable;
//# sourceMappingURL=expositionDegreeBTable.js.map