"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyPrioritizationTableSections = void 0;
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const hierarchyPrioritization_tables_1 = require("./hierarchyPrioritization.tables");
const hierarchyPrioritizationTableSections = (riskFactorGroupData, hierarchiesEntity, hierarchyTree, options = {
    hierarchyType: client_1.HierarchyEnum.OFFICE,
    isByGroup: false,
}) => {
    const tables = (0, hierarchyPrioritization_tables_1.hierarchyPrioritizationTables)(riskFactorGroupData, hierarchiesEntity, hierarchyTree, options);
    const sections = tables.map((table) => ({
        children: [table],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: docx_1.PageOrientation.LANDSCAPE },
            },
        },
    }));
    return sections;
};
exports.hierarchyPrioritizationTableSections = hierarchyPrioritizationTableSections;
//# sourceMappingURL=hierarchyPrioritization.section.js.map