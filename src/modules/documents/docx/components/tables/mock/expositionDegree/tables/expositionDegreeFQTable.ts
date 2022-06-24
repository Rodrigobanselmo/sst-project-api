import { HeightRule, Table, WidthType } from 'docx';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { NewBody } from '../body.converter';
import { rowBodyFisQui } from '../data/bodyFQ';
import { headerConverter } from '../header.converter';

// Table 2
export const expositionDegreeFQTable = () => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        headerConverter.map(tableHeaderElements.headerCell),
        {
          height: { value: 550, rule: HeightRule.EXACT },
        },
      ),
      ...NewBody(rowBodyFisQui).map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 700, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  return table;
};
