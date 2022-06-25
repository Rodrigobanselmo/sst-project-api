import { HeightRule, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { NewBodyC6 } from '../bodyC6.converter';
import { rowBodyFullBodyVibration } from '../data/bodyFBV';
import { headerFBV } from '../data/headerFBV';
import { NewHeaderC5 } from '../headerC5.converter';

// Table 2
export const quantityResultsFBVTable = () => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        NewHeaderC5(headerFBV).map(tableHeaderElements.headerCell),
        {
          height: { value: 550, rule: HeightRule.EXACT },
        },
      ),
      ...NewBodyC6(rowBodyFullBodyVibration).map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 550, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  return table;
};
