import { Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityRadHeader } from './quantityRad.constant';
import { quantityRadConverter } from './quantityRad.converter';

export const quantityRadTable = (
  riskGroupData: RiskFactorGroupDataEntity,
  hierarchyTree: IHierarchyMap,
) => {
  const quantityRadData = quantityRadConverter(riskGroupData, hierarchyTree);
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityRadHeader = NewQuantityRadHeader();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        quantityRadHeader.map(tableHeaderElements.headerCell),
      ),
      ...quantityRadData.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
    ],
  });

  return table;
};
