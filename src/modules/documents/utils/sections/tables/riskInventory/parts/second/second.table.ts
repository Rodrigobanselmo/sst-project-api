import { Table, WidthType } from 'docx';

import { MapData } from '../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { secondRiskInventoryHeader } from './second.constant';
import { dataConverter } from './second.converter';

export const secondRiskInventoryTableSection = (hierarchyData: MapData) => {
  const data = dataConverter(hierarchyData);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        secondRiskInventoryHeader.map(tableHeaderElements.headerCell),
      ),
      tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
    ],
  });

  return [tableHeaderElements.spacing(), table];
};