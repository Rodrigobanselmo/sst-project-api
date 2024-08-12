import { HeightRule, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../../elements/body';
import { TableHeaderElements } from '../../../elements/header';
import { NewBody } from '../body.converter';
import { rowBodyNoise } from '../data/bodyR';
import { headerQR } from '../data/headerQR';
import { NewHeader } from '../header.converter';

// Table 2
export const quantityResultsRTable = () => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(NewHeader(headerQR).map(tableHeaderElements.headerCell), {
        height: { value: 550, rule: HeightRule.EXACT },
      }),
      ...NewBody(rowBodyNoise).map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 550, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  return table;
};
