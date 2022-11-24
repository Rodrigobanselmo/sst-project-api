"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityHeatTable = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const quantityHeat_constant_1 = require("./quantityHeat.constant");
const quantityHeat_converter_1 = require("./quantityHeat.converter");
const quantityHeatTable = (riskGroupData, hierarchyTree) => {
    const quantityHeatData = (0, quantityHeat_converter_1.quantityHeatConverter)(riskGroupData, hierarchyTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const quantityHeatHeader = (0, quantityHeat_constant_1.NewQuantityHeatHeader)();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(quantityHeatHeader.map(tableHeaderElements.headerCell)),
            ...quantityHeatData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.quantityHeatTable = quantityHeatTable;
//# sourceMappingURL=quantityHeat.table.js.map