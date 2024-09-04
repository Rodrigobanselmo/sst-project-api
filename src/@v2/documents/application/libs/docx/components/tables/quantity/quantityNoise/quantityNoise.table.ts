import { Table, WidthType } from 'docx';

import { IDocumentRiskGroupDataConverter, IHierarchyMap } from './../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityNoiseHeader } from './quantityNoise.constant';
import { quantityNoiseConverter } from './quantityNoise.converter';

export const quantityNoiseTable = (
  riskGroupData: IDocumentRiskGroupDataConverter,
  hierarchyTree: IHierarchyMap,
) => {
  const quantityNoiseData = quantityNoiseConverter(riskGroupData.riskGroupData, riskGroupData.documentVersion, hierarchyTree);
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityNoiseHeader = NewQuantityNoiseHeader(riskGroupData.documentVersion.documentBase.data.isQ5 ? '5' : '3');

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(quantityNoiseHeader.map(tableHeaderElements.headerCell)),
      ...quantityNoiseData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
