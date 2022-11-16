import { HeightRule, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../../elements/body';
import { TableHeaderElements } from '../../../elements/header';
import { NewBody } from '../body.converter';
import { rowBodyNoise2 } from '../data/bodyR2';
import { headerQR } from '../data/headerQR';
import { NewHeader } from '../header.converter';

// Table 2
export const quantityResultsR2Table = () => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(NewHeader(headerQR).map(tableHeaderElements.headerCell), {
        height: { value: 550, rule: HeightRule.EXACT },
      }),
      ...NewBody(rowBodyNoise2).map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 550, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  return table;
};
