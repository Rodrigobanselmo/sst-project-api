import { PageOrientation, Table, WidthType } from 'docx';
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { HierarchyEntity } from 'src/modules/company/entities/hierarchy.entity';
import {
  firstRiskInventoryHeader,
  riskInventoryTitle,
} from 'src/modules/documents/utils/sections/tables/riskInventory/parts/first/first.constant';

import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { riskInventoryConverter } from './riskInventory.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';

export const riskInventoryTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchiesEntity: HierarchyEntity[],
) => {
  // const riskInventoryData = riskInventoryConverter(riskFactorGroupData);
  // const hierarchyData = hierarchyConverter(hierarchiesEntity);

  // const tableHeaderElements = new TableHeaderElements();
  // const tableBodyElements = new TableBodyElements();

  const firstTable = firstRiskInventoryTableSection(hierarchiesEntity);
  // const table = new Table({
  //   width: { size: 100, type: WidthType.PERCENTAGE },
  //   rows: [
  //     tableHeaderElements.headerTitle({
  //       text: 'INVENTÁRIO DE RISCO (APR)',
  //       columnSpan: firstRiskInventoryHeader.length,
  //     }),
  //     // tableHeaderElements.headerRow(
  //     //   riskInventoryHeader.map(tableHeaderElements.headerCell),
  //     // ),
  //     // ...riskInventoryData.map((data) =>
  //     //   tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
  //     // ),
  //   ],
  // });

  const section = {
    children: [firstTable],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  };

  return section;
};
