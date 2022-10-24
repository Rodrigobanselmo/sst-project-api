import { Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityVLHeader } from './quantityVL.constant';
import { quantityVLConverter } from './quantityVL.converter';

export const quantityVLTable = (
  riskGroupData: RiskFactorGroupDataEntity,
  hierarchyTree: IHierarchyMap,
) => {
  const quantityVLData = quantityVLConverter(riskGroupData, hierarchyTree);
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityVLHeader = NewQuantityVLHeader();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        quantityVLHeader.map(tableHeaderElements.headerCell),
      ),
      ...quantityVLData.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
    ],
  });

  return table;
};
