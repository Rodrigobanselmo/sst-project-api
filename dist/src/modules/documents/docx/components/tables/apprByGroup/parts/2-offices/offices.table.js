"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.officeRiskInventoryTableSection = void 0;
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const offices_constant_1 = require("./offices.constant");
const offices_converter_1 = require("./offices.converter");
const officeRiskInventoryTableSection = (hierarchyData) => {
    const data = (0, offices_converter_1.dataConverter)(hierarchyData);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow((0, offices_constant_1.secondRiskInventoryHeader)().map((data) => tableHeaderElements.headerCell(Object.assign({}, data)))),
            tableBodyElements.tableRow(data.map((data) => tableBodyElements.tableCell(Object.assign(Object.assign({}, data), { margins: { top: 60, bottom: 60 } })))),
        ],
    });
    return [tableHeaderElements.spacing(), table];
};
exports.officeRiskInventoryTableSection = officeRiskInventoryTableSection;
//# sourceMappingURL=offices.table.js.map