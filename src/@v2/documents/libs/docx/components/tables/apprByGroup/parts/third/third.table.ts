import { Table, WidthType } from 'docx';
import { HierarchyMapData, IHierarchyMap } from '../../../../../converter/hierarchy.converter';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { ThirdRiskInventoryColumnsHeader, ThirdRiskInventoryHeader } from './third.constant';
import { dataConverter } from './third.converter';

export const thirdRiskInventoryTableSection = (
  riskFactorGroupData: any,
  hierarchyData: HierarchyMapData,
  hierarchyTree: IHierarchyMap,
  options: {
    isHideCA: boolean;
    isHideOrigin: boolean;
  },
) => {
  const data = dataConverter(riskFactorGroupData, hierarchyData, hierarchyTree, options);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(ThirdRiskInventoryHeader(options.isHideOrigin).map(tableHeaderElements.headerCell)),
      tableHeaderElements.headerRow(ThirdRiskInventoryColumnsHeader(options.isHideOrigin).map(tableHeaderElements.headerCell)),
      ...data.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return [tableHeaderElements.spacing(), table];
};
