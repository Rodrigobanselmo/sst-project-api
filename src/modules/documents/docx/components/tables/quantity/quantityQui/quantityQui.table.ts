import { Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityQuiHeader } from './quantityQui.constant';
import { quantityQuiConverter } from './quantityQui.converter';

export const quantityQuiTable = (
  riskGroupData: RiskFactorGroupDataEntity,
  hierarchyTree: IHierarchyMap,
) => {
  const quantityQuiData = quantityQuiConverter(riskGroupData, hierarchyTree);
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityQuiHeader = NewQuantityQuiHeader();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        quantityQuiHeader.map(tableHeaderElements.headerCell),
      ),
      ...quantityQuiData.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
    ],
  });

  return table;
};
