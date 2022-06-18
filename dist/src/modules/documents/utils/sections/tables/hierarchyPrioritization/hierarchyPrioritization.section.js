"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyPrioritizationTableSection = void 0;
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const arrayChunks_1 = require("../../../../../../shared/utils/arrayChunks");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const hierarchyPrioritization_converter_1 = require("./hierarchyPrioritization.converter");
const hierarchyPrioritizationTableSection = (riskFactorGroupData, hierarchiesEntity, options = {
    hierarchyType: client_1.HierarchyEnum.SECTOR,
    isByGroup: false,
}) => {
    const { bodyData, headerData } = (0, hierarchyPrioritization_converter_1.hierarchyPrioritizationConverter)(riskFactorGroupData, hierarchiesEntity, options);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const headerChunks = (0, arrayChunks_1.arrayChunks)(headerData, 49, { balanced: true }).map((header, index) => {
        if (index === 0)
            return header;
        return [headerData[0], ...header];
    });
    const bodyChunks = bodyData.map((body) => (0, arrayChunks_1.arrayChunks)(body, 49, { balanced: true }).map((bodyChuck, index) => {
        if (index === 0)
            return bodyChuck;
        return [body[0], ...bodyChuck];
    }));
    const tables = headerChunks.map((chunk, index) => {
        return new docx_1.Table({
            width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
            rows: [
                tableHeaderElements.headerRow(chunk.map(tableHeaderElements.headerCell)),
                ...bodyChunks.map((data) => tableBodyElements.tableRow(data[index].map(tableBodyElements.tableCell))),
            ],
        });
    });
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
exports.hierarchyPrioritizationTableSection = hierarchyPrioritizationTableSection;
//# sourceMappingURL=hierarchyPrioritization.section.js.map