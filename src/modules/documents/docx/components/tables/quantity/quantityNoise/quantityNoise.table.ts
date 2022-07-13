import { Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyMap } from './../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityNoiseHeader } from './quantityNoise.constant';
import { quantityNoiseConverter } from './quantityNoise.converter';

export const quantityNoiseTable = (
  riskGroupData: RiskFactorGroupDataEntity,
  hierarchyTree: IHierarchyMap,
) => {
  const quantityNoiseData = quantityNoiseConverter(
    riskGroupData,
    hierarchyTree,
  );
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityNoiseHeader = NewQuantityNoiseHeader(
    riskGroupData.isQ5 ? '5' : '3',
  );

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        quantityNoiseHeader.map(tableHeaderElements.headerCell),
      ),
      ...quantityNoiseData.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
    ],
  });

  return table;
};
