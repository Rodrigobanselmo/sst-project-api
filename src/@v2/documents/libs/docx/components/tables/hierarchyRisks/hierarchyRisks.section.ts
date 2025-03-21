import { HierarchyEnum } from '@prisma/client';
import { PageOrientation, Paragraph, Table, WidthType } from 'docx';

import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { IHierarchyData, IHierarchyMap, IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { hierarchyRisksConverter, IHierarchyRiskOptions } from './hierarchyRisks.converter';
import { arrayChunks } from '@/@v2/shared/utils/helpers/array-chunks';

export const hierarchyRisksTableSections = (
  riskFactorGroupData: IRiskGroupDataConverter[],
  hierarchiesEntity: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  options: IHierarchyRiskOptions = {
    hierarchyType: HierarchyEnum.SECTOR,
  },
) => {
  const { bodyData, headerData } = hierarchyRisksConverter(riskFactorGroupData, hierarchiesEntity, hierarchyTree, options);

  const noData = headerData.length == 1 || bodyData.length == 0;

  if (noData) return [];

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const headerChunks = arrayChunks(headerData, 49, { balanced: true }).map((header, index) => {
    if (index === 0) return header;
    return [headerData[0], ...header];
  });

  const bodyChunks = bodyData.map((body) =>
    arrayChunks(body, 49, { balanced: true }).map((bodyChuck, index) => {
      if (index === 0) return bodyChuck;
      return [body[0], ...bodyChuck];
    }),
  );

  const tables = headerChunks.map((chunk, index) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [tableHeaderElements.headerRow(chunk.map(tableHeaderElements.headerCell)), ...bodyChunks.map((data) => tableBodyElements.tableRow(data[index].map(tableBodyElements.tableCell)))],
    });
  });

  const sections = tables.map((table) => ({
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  }));

  return sections;
};

export const hierarchyRisksTableAllSections = (
  riskFactorGroupData: IRiskGroupDataConverter[],
  hierarchiesEntity: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const table1 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Relação de Fatores de Risco e Perigos por Superintendências da Empresa',
    },
    {
      type: DocumentSectionChildrenTypeEnum.BREAK,
    },
  ]);

  const table2 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Relação de Fatores de Risco e Perigos por Diretorias da Empresa',
    },
    {
      type: DocumentSectionChildrenTypeEnum.BREAK,
    },
  ]);

  const table3 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Relação de Fatores de Risco e Perigos por Setores da Empresa',
    },
    {
      type: DocumentSectionChildrenTypeEnum.BREAK,
    },
  ]);

  const table4 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Relação de Fatores de Risco e Perigos por Sub Setores da Empresa',
    },
    {
      type: DocumentSectionChildrenTypeEnum.BREAK,
    },
  ]);

  const allTables = [
    [HierarchyEnum.DIRECTORY, table1],
    [HierarchyEnum.MANAGEMENT, table2],
    [HierarchyEnum.SECTOR, table3],
    [HierarchyEnum.SUB_SECTOR, table4],
  ].map(([type, tableConverted]) => {
    const tableHeader = tableConverted as (Paragraph | Table)[];

    const section = hierarchyRisksTableSections(riskFactorGroupData, hierarchiesEntity, hierarchyTree, {
      hierarchyType: type as any,
    });

    if (section.length === 0) return null;

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
