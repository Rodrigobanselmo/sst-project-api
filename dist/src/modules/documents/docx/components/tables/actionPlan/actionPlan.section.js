"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPlanTableSection = void 0;
const docx_1 = require("docx");
const actionPlan_constant_1 = require("./actionPlan.constant");
const actionPlan_converter_1 = require("./actionPlan.converter");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const actionPlanTableSection = (riskFactorGroupData, hierarchyTree) => {
    const actionPlanData = (0, actionPlan_converter_1.actionPlanConverter)(riskFactorGroupData, hierarchyTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerTitle(actionPlan_constant_1.actionPlanTitle, actionPlan_constant_1.actionPlanHeader.length),
            tableHeaderElements.headerRow(actionPlan_constant_1.actionPlanHeader.map(tableHeaderElements.headerCell)),
            ...actionPlanData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
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
exports.actionPlanTableSection = actionPlanTableSection;
//# sourceMappingURL=actionPlan.section.js.map