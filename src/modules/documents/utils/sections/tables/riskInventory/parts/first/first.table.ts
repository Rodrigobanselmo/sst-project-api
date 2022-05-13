import { PageOrientation, Table, WidthType } from 'docx';
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { HierarchyEntity } from 'src/modules/company/entities/hierarchy.entity';
import {
  firstRiskInventoryHeader,
  riskInventoryTitle,
} from 'src/modules/documents/utils/sections/tables/riskInventory/parts/first/first.constant';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';

import { hierarchyConverter } from './converter/hierarchy.converter';

export const firstRiskInventoryTableSection = (
  hierarchiesEntity: HierarchyEntity[],
) => {
  // const riskInventoryData = riskInventoryConverter(riskFactorGroupData);
  const hierarchyData = hierarchyConverter(hierarchiesEntity);

  console.log('hierarchyData', hierarchyData);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerTitle({
        text: 'INVENTÁRIO DE RISCO (APR)',
        columnSpan: firstRiskInventoryHeader.length,
      }),
      // tableHeaderElements.headerRow(
      //   riskInventoryHeader.map(tableHeaderElements.headerCell),
      // ),
      // ...riskInventoryData.map((data) =>
      //   tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      // ),
    ],
  });

  return table;
};
