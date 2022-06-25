import { HeightRule, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { NewBodyC5 } from '../bodyC5.converter';
import { rowBodyLocalizationVibration } from '../data/bodyLV';
import { headerLV } from '../data/headerLV';
import { NewHeaderC4S } from '../headerC4S.converter';

// Table 2
export const quantityResultsLVTable = () => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        NewHeaderC4S(headerLV).map(tableHeaderElements.headerCell),
        {
          height: { value: 550, rule: HeightRule.EXACT },
        },
      ),
      ...NewBodyC5(rowBodyLocalizationVibration).map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 550, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  return table;
};
