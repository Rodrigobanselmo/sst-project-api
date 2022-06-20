"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyPlanTableSection = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const hierarchyPlan_converter_1 = require("./hierarchyPlan.converter");
const hierarchyPlanTableSection = (hierarchiesEntity, homoGroupTree) => {
    const { bodyData, headerData } = (0, hierarchyPlan_converter_1.hierarchyPlanConverter)(hierarchiesEntity, homoGroupTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(headerData.map(tableHeaderElements.headerCell)),
            ...bodyData
                .filter((data) => data)
                .map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
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
exports.hierarchyPlanTableSection = hierarchyPlanTableSection;
//# sourceMappingURL=hierarchyPlan.section.js.map