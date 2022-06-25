import { HeightRule, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { NewBody } from '../body.converter';
import { rowBodyHeat } from '../data/bodyH';
import { headerH } from '../data/headerH';
import { NewHeader } from '../header.converter';

// Table 2
export const quantityResultsHTable = () => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        NewHeader(headerH).map(tableHeaderElements.headerCell),
        {
          height: { value: 550, rule: HeightRule.EXACT },
        },
      ),
      ...NewBody(rowBodyHeat).map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 550, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  return table;
};
