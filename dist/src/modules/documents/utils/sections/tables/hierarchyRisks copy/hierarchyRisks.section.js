"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyRisksTableSection = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const hierarchyRisks_converter_1 = require("./hierarchyRisks.converter");
const hierarchyRisksTableSection = (riskFactorGroupData, hierarchiesEntity) => {
    const { bodyData, headerData } = (0, hierarchyRisks_converter_1.hierarchyRisksConverter)(riskFactorGroupData, hierarchiesEntity);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(headerData.map(tableHeaderElements.headerCell)),
            ...bodyData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    const section = {
        children: [table],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: docx_1.PageOrientation.LANDSCAPE },
            },
        },
    };
    return section;
};
exports.hierarchyRisksTableSection = hierarchyRisksTableSection;
//# sourceMappingURL=hierarchyRisks.section.js.map