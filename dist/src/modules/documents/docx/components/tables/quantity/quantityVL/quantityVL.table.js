"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVLTable = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const quantityVL_constant_1 = require("./quantityVL.constant");
const quantityVL_converter_1 = require("./quantityVL.converter");
const quantityVLTable = (riskGroupData, hierarchyTree) => {
    const quantityVLData = (0, quantityVL_converter_1.quantityVLConverter)(riskGroupData, hierarchyTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const quantityVLHeader = (0, quantityVL_constant_1.NewQuantityVLHeader)();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(quantityVLHeader.map(tableHeaderElements.headerCell)),
            ...quantityVLData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.quantityVLTable = quantityVLTable;
//# sourceMappingURL=quantityVL.table.js.map