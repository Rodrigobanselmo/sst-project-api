import { Table, WidthType } from 'docx';
import { firstRiskInventoryHeader } from './first.constant';

import { HierarchyMapData, IDocumentRiskGroupDataConverter, IHomoGroupMap } from '../../../../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { borderBottomStyle, TableHeaderElements } from '../../elements/header';
import { documentConverter } from './first.converter';

export const firstRiskInventoryTableSection = (
  riskFactorGroupData: IDocumentRiskGroupDataConverter,
  homoGroupTree: IHomoGroupMap,
  hierarchyData: HierarchyMapData,
  isByGroup: boolean,
) => {
  const riskInventoryData = documentConverter(riskFactorGroupData, homoGroupTree, hierarchyData, isByGroup);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerTitle({
        text: 'INVENTÁRIO DE RISCO (APP/APR)',
        columnSpan: firstRiskInventoryHeader.length,
        borders: borderBottomStyle,
      }),
      ...riskInventoryData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
