"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityQuiTable = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const quantityQui_constant_1 = require("./quantityQui.constant");
const quantityQui_converter_1 = require("./quantityQui.converter");
const quantityQuiTable = (riskGroupData, hierarchyTree) => {
    const quantityQuiData = (0, quantityQui_converter_1.quantityQuiConverter)(riskGroupData, hierarchyTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const quantityQuiHeader = (0, quantityQui_constant_1.NewQuantityQuiHeader)();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(quantityQuiHeader.map(tableHeaderElements.headerCell)),
            ...quantityQuiData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.quantityQuiTable = quantityQuiTable;
//# sourceMappingURL=quantityQui.table.js.map