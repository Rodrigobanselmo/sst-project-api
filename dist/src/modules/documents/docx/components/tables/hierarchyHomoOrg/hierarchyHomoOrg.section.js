"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyHomoOrgSection = void 0;
const docx_1 = require("docx");
const hierarchyHomoOrg_table_1 = require("./hierarchyHomoOrg.table");
const hierarchyHomoOrgSection = (hierarchiesEntity, homoGroupTree, { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter } = {
    showHomogeneous: true,
    showDescription: true,
    showHomogeneousDescription: false,
    type: undefined,
    groupIdFilter: undefined,
}) => {
    const { table } = (0, hierarchyHomoOrg_table_1.hierarchyHomoOrgTable)(hierarchiesEntity, homoGroupTree, {
        showDescription,
        showHomogeneous,
        showHomogeneousDescription,
        type,
        groupIdFilter,
    });
    const section = {
        children: [table],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: docx_1.PageOrientation.LANDSCAPE },
            },
        },
        footers: {
            default: new docx_1.Footer({
                children: [],
            }),
        },
        headers: {
            default: new docx_1.Header({
                children: [],
            }),
        },
    };
    return section;
};
exports.hierarchyHomoOrgSection = hierarchyHomoOrgSection;
//# sourceMappingURL=hierarchyHomoOrg.section.js.map