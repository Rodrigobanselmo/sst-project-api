import { HeightRule, Table, WidthType } from 'docx';
import { TableBodyElements } from '../../elements/body';
import { NewTableData } from './table.converter';

// Table 2
export const matrizTable = () => {
  const tableBodyElements = new TableBodyElements();

  const dataTable = NewTableData();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      ...dataTable.map((data, index) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: {
            value: index >= dataTable.length - 2 ? 300 : 600,
            rule: HeightRule.EXACT,
          },
        }),
      ),
    ],
  });

  return table;
};
