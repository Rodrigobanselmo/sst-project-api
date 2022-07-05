import { HomoTypeEnum } from '@prisma/client';
import { Footer, Header, PageOrientation, Table, WidthType } from 'docx';

import {
  IHierarchyData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import {
  ConverterProps,
  hierarchyPlanConverter,
} from './hierarchyHomoOrg.converter';

export const hierarchyHomoOrgSection = (
  hierarchiesEntity: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  { showDescription, showHomogeneous, type }: ConverterProps = {
    showHomogeneous: true,
    showDescription: true,
    type: undefined,
  },
) => {
  const { bodyData, headerData } = hierarchyPlanConverter(
    hierarchiesEntity,
    homoGroupTree,
    { showDescription, showHomogeneous, type },
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
    footers: {
      default: new Footer({
        children: [],
      }),
    },
    headers: {
      default: new Header({
        children: [],
      }),
    },
  };

  return section;
};
