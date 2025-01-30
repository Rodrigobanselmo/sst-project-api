import { Table, WidthType } from 'docx';

import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityRadHeader } from './quantityRad.constant';
import { quantityRadConverter } from './quantityRad.converter';

export const quantityRadTable = (riskGroupData: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const quantityRadData = quantityRadConverter(riskGroupData, hierarchyTree);
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityRadHeader = NewQuantityRadHeader();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(quantityRadHeader.map(tableHeaderElements.headerCell)),
      ...quantityRadData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
