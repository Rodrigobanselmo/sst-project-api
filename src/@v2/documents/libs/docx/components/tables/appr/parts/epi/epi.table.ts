import { Table, WidthType } from 'docx';

import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { epiRiskInventoryHeader } from './epi.constant';
import { dataConverter } from './epi.converter';
import { EPIModel } from '@/@v2/documents/domain/models/epis.model';

export const epiRiskInventoryTableSection = (epis: EPIModel[], isHideCA: boolean) => {
  if (epis.length === 0) return [];

  let data = dataConverter(epis, isHideCA);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(epiRiskInventoryHeader().map(tableHeaderElements.headerCell)),
      tableBodyElements.tableRow(
        data.map((data) =>
          tableBodyElements.tableCell({
            ...data,
            margins: { top: 60, bottom: 60 },
          }),
        ),
      ),
    ],
  });

  return [tableHeaderElements.spacing(), table];
};
