"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionControlTable = void 0;
const docx_1 = require("docx");
const versionControl_constant_1 = require("./versionControl.constant");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const versionControl_converter_1 = require("./versionControl.converter");
const versionControlTable = (riskDocumentEntity) => {
    const versionControlData = (0, versionControl_converter_1.versionControlConverter)(riskDocumentEntity);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(versionControl_constant_1.versionControlHeader.map(tableHeaderElements.headerCell)),
            ...versionControlData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.versionControlTable = versionControlTable;
//# sourceMappingURL=versionControl.table.js.map