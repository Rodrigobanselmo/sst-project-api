import { Table, WidthType } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../checklist/entities/riskGroupData.entity';
import {
  HierarchyMapData,
  IHierarchyMap,
} from '../../../../../converter/hierarchy.converter';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import {
  thirdRiskInventoryColumnsHeader,
  thirdRiskInventoryHeader,
} from './third.constant';
import { dataConverter } from './third.converter';

export const thirdRiskInventoryTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchyData: HierarchyMapData,
  hierarchyTree: IHierarchyMap,
) => {
  const data = dataConverter(riskFactorGroupData, hierarchyData, hierarchyTree);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        thirdRiskInventoryHeader.map(tableHeaderElements.headerCell),
      ),
      tableHeaderElements.headerRow(
        thirdRiskInventoryColumnsHeader.map(tableHeaderElements.headerCell),
      ),
      ...data.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
    ],
  });

  return [tableHeaderElements.spacing(), table];
};
