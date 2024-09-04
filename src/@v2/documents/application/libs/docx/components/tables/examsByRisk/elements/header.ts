import {
  AlignmentType,
  HeightRule,
  ITableCellOptions,
  ITableRowOptions,
  Paragraph,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';

import { palette } from '../../../../constants/palette';
import { borderStyle } from './body';

export interface headerTableProps extends Partial<ITableCellOptions> {
  text: string;
  size?: number;
  position?: number;
}

export class TableHeaderElements {
  headerRow(tableCell: TableCell[], options?: Partial<ITableRowOptions>) {
    return new TableRow({
      height: { value: 600, rule: HeightRule.EXACT },
      tableHeader: true,
      children: [...tableCell],
      ...options,
    });
  }

  headerCell({ text, size = 10, ...rest }: headerTableProps) {
    return new TableCell({
      children: [
        ...(text || '').split('\n').map(
          (value) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: value,
                  size: 12,
                  bold: true,
                  color: palette.text.main.string,
                }),
              ],
              spacing: {
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
            }),
        ),
      ],
      shading: { fill: palette.table.header.string },
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      borders: borderStyle,
      ...rest,
    });
  }
}
