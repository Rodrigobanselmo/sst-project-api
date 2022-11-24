"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyHomoOrgTable = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const hierarchyHomoOrg_converter_1 = require("./hierarchyHomoOrg.converter");
const hierarchyHomoOrgTable = (hierarchiesEntity, homoGroupTree, { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter } = {
    showHomogeneous: true,
    showDescription: true,
    showHomogeneousDescription: false,
    type: undefined,
    groupIdFilter: undefined,
}) => {
    const { bodyData, headerData } = (0, hierarchyHomoOrg_converter_1.hierarchyPlanConverter)(hierarchiesEntity, homoGroupTree, {
        showDescription,
        showHomogeneous,
        type,
        showHomogeneousDescription,
        groupIdFilter,
    });
    const groupName = () => {
        if (!type)
            return 'GSE';
        if (type === 'ENVIRONMENT')
            return 'Ambiente';
        return 'Mão de Obra';
    };
    if (showHomogeneous)
        headerData[0].text = groupName();
    if (showHomogeneous && !showHomogeneousDescription)
        headerData.splice(1, 1);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(headerData.map(tableHeaderElements.headerCell)),
            ...bodyData.filter((data) => data).map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    const missingBody = bodyData.length === 0;
    return { table, missingBody };
};
exports.hierarchyHomoOrgTable = hierarchyHomoOrgTable;
//# sourceMappingURL=hierarchyHomoOrg.table.js.map