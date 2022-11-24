"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondRiskInventoryTableSection = void 0;
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const second_constant_1 = require("./second.constant");
const second_converter_1 = require("./second.converter");
const secondRiskInventoryTableSection = (hierarchyData, isByGroup) => {
    let data = (0, second_converter_1.dataConverter)(hierarchyData);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    if (isByGroup)
        data = data.slice(1, 2);
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow((0, second_constant_1.secondRiskInventoryHeader)(isByGroup).map(tableHeaderElements.headerCell)),
            tableBodyElements.tableRow(data.map((data) => tableBodyElements.tableCell(Object.assign(Object.assign({}, data), { margins: { top: 60, bottom: 60 } })))),
        ],
    });
    return [tableHeaderElements.spacing(), table];
};
exports.secondRiskInventoryTableSection = secondRiskInventoryTableSection;
//# sourceMappingURL=second.table.js.map