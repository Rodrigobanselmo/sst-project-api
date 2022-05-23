"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thirdRiskInventoryTableSection = void 0;
const docx_1 = require("docx");
const riskGroupData_entity_1 = require("../../../../../../../checklist/entities/riskGroupData.entity");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const third_constant_1 = require("./third.constant");
const third_converter_1 = require("./third.converter");
const thirdRiskInventoryTableSection = (riskFactorGroupData) => {
    const data = (0, third_converter_1.dataConverter)(riskFactorGroupData);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(third_constant_1.thirdRiskInventoryHeader.map(tableHeaderElements.headerCell)),
            tableHeaderElements.headerRow(third_constant_1.thirdRiskInventoryColumnsHeader.map(tableHeaderElements.headerCell)),
            ...data.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return [tableHeaderElements.spacing(), table];
};
exports.thirdRiskInventoryTableSection = thirdRiskInventoryTableSection;
//# sourceMappingURL=third.table.js.map