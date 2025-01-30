import { HierarchyEnum } from '@prisma/client';
import { Table, WidthType } from 'docx';

import { IHierarchyData, IHierarchyMap, IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { hierarchyPrioritizationConverter, IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
import { arrayChunks } from '@/@v2/shared/utils/helpers/array-chunks';

export const hierarchyPrioritizationTables = (
  riskFactorGroupData: IRiskGroupDataConverter[],
  hierarchiesEntity: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  options: IHierarchyPrioritizationOptions = {
    hierarchyType: HierarchyEnum.OFFICE,
    isByGroup: false,
  },
) => {
  const { bodyData, headerData } = hierarchyPrioritizationConverter(
    riskFactorGroupData,
    hierarchiesEntity,
    hierarchyTree,
    options,
  );

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
      rows: [
        tableHeaderElements.headerRow(chunk.map(tableHeaderElements.headerCell)),
        ...bodyChunks.map((data) => tableBodyElements.tableRow(data[index].map(tableBodyElements.tableCell))),
      ],
    });
  });

  return tables;
};
