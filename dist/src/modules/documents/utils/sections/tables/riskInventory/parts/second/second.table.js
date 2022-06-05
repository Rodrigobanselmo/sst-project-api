"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondRiskInventoryTableSection = void 0;
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const second_constant_1 = require("./second.constant");
const second_converter_1 = require("./second.converter");
const secondRiskInventoryTableSection = (hierarchyData) => {
    const data = (0, second_converter_1.dataConverter)(hierarchyData);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(second_constant_1.secondRiskInventoryHeader.map(tableHeaderElements.headerCell)),
            tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
        ],
    });
    return [tableHeaderElements.spacing(), table];
};
exports.secondRiskInventoryTableSection = secondRiskInventoryTableSection;
//# sourceMappingURL=second.table.js.map