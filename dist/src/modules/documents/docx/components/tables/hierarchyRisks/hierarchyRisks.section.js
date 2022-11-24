"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyRisksTableAllSections = exports.hierarchyRisksTableSections = void 0;
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const arrayChunks_1 = require("../../../../../../shared/utils/arrayChunks");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const hierarchyRisks_converter_1 = require("./hierarchyRisks.converter");
const hierarchyRisksTableSections = (riskFactorGroupData, hierarchiesEntity, hierarchyTree, options = {
    hierarchyType: client_1.HierarchyEnum.SECTOR,
}) => {
    const { bodyData, headerData } = (0, hierarchyRisks_converter_1.hierarchyRisksConverter)(riskFactorGroupData, hierarchiesEntity, hierarchyTree, options);
    const noData = headerData.length == 1 || bodyData.length == 0;
    if (noData)
        return [];
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
exports.hierarchyRisksTableSections = hierarchyRisksTableSections;
const hierarchyRisksTableAllSections = (riskFactorGroupData, hierarchiesEntity, hierarchyTree, convertToDocx) => {
    const table1 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Relação de Fatores de Risco e Perigos por Diretorias da Empresa',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
        },
    ]);
    const table2 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Relação de Fatores de Risco e Perigos por Gerências da Empresa',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
        },
    ]);
    const table3 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Relação de Fatores de Risco e Perigos por Setores da Empresa',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
        },
    ]);
    const table4 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Relação de Fatores de Risco e Perigos por Sub Setores da Empresa',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
        },
    ]);
    const allTables = [
        [client_1.HierarchyEnum.DIRECTORY, table1],
        [client_1.HierarchyEnum.MANAGEMENT, table2],
        [client_1.HierarchyEnum.SECTOR, table3],
        [client_1.HierarchyEnum.SUB_SECTOR, table4],
    ].map(([type, tableConverted]) => {
        const tableHeader = tableConverted;
        const section = (0, exports.hierarchyRisksTableSections)(riskFactorGroupData, hierarchiesEntity, hierarchyTree, {
            hierarchyType: type,
        });
        if (section.length === 0)
            return null;
        const table = section
            .map((s) => s['children'])
            .reduce((acc, curr) => {
            return [...acc, ...curr];
        }, []);
        tableHeader.splice(1, 0, table[0]);
        return tableHeader;
    });
    return allTables
        .filter((table) => table !== null)
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
};
exports.hierarchyRisksTableAllSections = hierarchyRisksTableAllSections;
//# sourceMappingURL=hierarchyRisks.section.js.map