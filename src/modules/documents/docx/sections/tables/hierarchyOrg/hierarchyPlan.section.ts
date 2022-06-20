import { PageOrientation, Table, WidthType } from 'docx';

import {
  IHierarchyData,
  IHomoGroupMap,
} from '../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { hierarchyPlanConverter } from './hierarchyPlan.converter';

export const hierarchyPlanTableSection = (
  hierarchiesEntity: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
) => {
  const { bodyData, headerData } = hierarchyPlanConverter(
    hierarchiesEntity,
    homoGroupTree,
  );

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        headerData.map(tableHeaderElements.headerCell),
      ),
      ...bodyData
        .filter((data) => data)
        .map((data) =>
          tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
        ),
    ],
  });

  const section = {
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  };

  return section;
};
