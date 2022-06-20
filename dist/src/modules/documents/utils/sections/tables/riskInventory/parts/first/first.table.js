"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstRiskInventoryTableSection = void 0;
const docx_1 = require("docx");
const first_constant_1 = require("./first.constant");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const first_converter_1 = require("./first.converter");
const firstRiskInventoryTableSection = (riskFactorGroupData, hierarchyData) => {
    const riskInventoryData = (0, first_converter_1.documentConverter)(riskFactorGroupData, hierarchyData);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerTitle({
                text: 'INVENTÁRIO DE RISCO (APP/APR)',
                columnSpan: first_constant_1.firstRiskInventoryHeader.length,
                borders: header_1.borderBottomStyle,
            }),
            ...riskInventoryData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.firstRiskInventoryTableSection = firstRiskInventoryTableSection;
//# sourceMappingURL=first.table.js.map