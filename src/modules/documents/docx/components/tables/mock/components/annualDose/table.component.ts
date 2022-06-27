import { HeightRule, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { NewBody } from './body.converter';
import { NewHeader, NewTopHeader } from './header.converter';

// Table 2
export const annualDoseTable = () => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        NewTopHeader().map(tableHeaderElements.headerCell),
        {
          height: { value: 300, rule: HeightRule.ATLEAST },
        },
      ),
      tableHeaderElements.headerRow(
        NewHeader().map(tableHeaderElements.headerCell),
        {
          height: { value: 350, rule: HeightRule.ATLEAST },
        },
      ),
      ...NewBody().map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 350, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  return table;
};
