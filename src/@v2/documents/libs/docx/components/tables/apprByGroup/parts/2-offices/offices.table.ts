import { Table, WidthType } from 'docx';

import { HierarchyMapData, IHierarchyDataConverter } from '../../../../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { secondRiskInventoryHeader } from './offices.constant';
import { dataConverter } from './offices.converter';

export const officeRiskInventoryTableSection = (
  hierarchyData: HierarchyMapData & { hierarchies: IHierarchyDataConverter[] },
) => {
  const data = dataConverter(hierarchyData);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        secondRiskInventoryHeader().map((data) => tableHeaderElements.headerCell({ ...data })),
      ),
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
