import { Table, WidthType } from 'docx';

import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { secondRiskInventoryHeader } from './second.constant';
import { dataConverter } from './second.converter';

export const secondRiskInventoryTableSection = (hierarchyData: HierarchyMapData, isByGroup: boolean) => {
  let data = dataConverter(hierarchyData);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  if (isByGroup) data = data.slice(1, 2);

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(secondRiskInventoryHeader(isByGroup).map(tableHeaderElements.headerCell)),
      tableBodyElements.tableRow(
        data.map((data) =>
          tableBodyElements.tableCell({
            ...data,
            margins: { top: 60, bottom: 60 },
          }),
        ),
      ),
    ],
  });

  return [tableHeaderElements.spacing(), table];
};
