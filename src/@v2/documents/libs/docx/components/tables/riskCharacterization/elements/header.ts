import {
  AlignmentType,
  HeightRule,
  ITableCellOptions,
  Paragraph,
  TableCell,
  TableRow,
  TextDirection,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { palette } from '../../../../constants/palette';

export interface headerTableProps extends Partial<ITableCellOptions> {
  text: string;
  size?: number;
  position?: number;
}

export class TableHeaderElements {
  headerRow(tableCell: TableCell[]) {
    return new TableRow({
      height: { value: 1600, rule: HeightRule.EXACT },
      tableHeader: true,
      children: [...tableCell],
    });
  }

  headerCell({ text, size = 10, ...rest }: headerTableProps) {
    return new TableCell({
      children: [
        ...text.split('\n').map(
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
      textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
