import { Table, WidthType } from 'docx';
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { firstRiskInventoryHeader } from 'src/modules/documents/utils/sections/tables/riskInventory/parts/first/first.constant';

import { MapData } from '../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { borderBottomStyle, TableHeaderElements } from '../../elements/header';
import { documentConverter } from './first.converter';

export const firstRiskInventoryTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchyData: MapData,
) => {
  const riskInventoryData = documentConverter(
    riskFactorGroupData,
    hierarchyData,
  );

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerTitle({
        text: 'INVENTÁRIO DE RISCO (APR)',
        columnSpan: firstRiskInventoryHeader.length,
        borders: borderBottomStyle,
      }),
      ...riskInventoryData.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
    ],
  });

  return table;
};
