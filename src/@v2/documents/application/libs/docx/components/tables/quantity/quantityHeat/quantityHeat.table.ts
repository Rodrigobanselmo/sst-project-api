import { Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityHeatHeader } from './quantityHeat.constant';
import { quantityHeatConverter } from './quantityHeat.converter';

export const quantityHeatTable = (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => {
  const quantityHeatData = quantityHeatConverter(riskGroupData, hierarchyTree);
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityHeatHeader = NewQuantityHeatHeader();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(quantityHeatHeader.map(tableHeaderElements.headerCell)),
      ...quantityHeatData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
