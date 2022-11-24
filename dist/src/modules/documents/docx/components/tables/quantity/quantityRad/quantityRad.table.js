"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityRadTable = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const quantityRad_constant_1 = require("./quantityRad.constant");
const quantityRad_converter_1 = require("./quantityRad.converter");
const quantityRadTable = (riskGroupData, hierarchyTree) => {
    const quantityRadData = (0, quantityRad_converter_1.quantityRadConverter)(riskGroupData, hierarchyTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const quantityRadHeader = (0, quantityRad_constant_1.NewQuantityRadHeader)();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(quantityRadHeader.map(tableHeaderElements.headerCell)),
            ...quantityRadData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.quantityRadTable = quantityRadTable;
//# sourceMappingURL=quantityRad.table.js.map