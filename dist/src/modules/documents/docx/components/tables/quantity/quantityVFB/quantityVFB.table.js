"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVFBTable = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const quantityVFB_constant_1 = require("./quantityVFB.constant");
const quantityVFB_converter_1 = require("./quantityVFB.converter");
const quantityVFBTable = (riskGroupData, hierarchyTree) => {
    const quantityVFBData = (0, quantityVFB_converter_1.quantityVFBConverter)(riskGroupData, hierarchyTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const quantityVFBHeader = (0, quantityVFB_constant_1.NewQuantityVFBHeader)();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(quantityVFBHeader.map(tableHeaderElements.headerCell)),
            ...quantityVFBData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.quantityVFBTable = quantityVFBTable;
//# sourceMappingURL=quantityVFB.table.js.map