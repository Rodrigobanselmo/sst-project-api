import { AlignmentType, BorderStyle, ITableCellOptions, Paragraph, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';
import { palette } from '../../../../../../../shared/constants/palette';

export interface headerTableProps extends Partial<ITableCellOptions> {
  text: string;
  size?: number;
  borderBottom?: boolean;
  position?: number;
  columnSpan?: number;
}

export const whiteBorder = {
  style: BorderStyle.SINGLE,
  color: 'ffffff',
  size: 20,
};

export const whiteColumnBorder = {
  style: BorderStyle.SINGLE,
  color: 'ffffff',
  size: 5,
};

export const borderBottomStyle = {
  top: { style: BorderStyle.NIL },
  bottom: whiteBorder,
  left: { style: BorderStyle.NIL },
  right: { style: BorderStyle.NIL },
};

export const borderRightStyle = {
  top: { style: BorderStyle.NIL },
  bottom: { style: BorderStyle.NIL },
  left: { style: BorderStyle.NIL },
  right: whiteBorder,
};

export class TableHeaderElements {
  headerTitle({ text, columnSpan, ...props }: headerTableProps) {
    return new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  size: 14,
                  bold: true,
                  color: '000000',
                }),
              ],
              spacing: {
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: palette.table.header.string },
          verticalAlign: VerticalAlign.CENTER,
          columnSpan: columnSpan,
          margins: { top: 60, bottom: 60 },
          ...props,
        }),
      ],
    });
  }

  headerRow(tableCell: TableCell[]) {
    return new TableRow({
      tableHeader: true,
      children: [...tableCell],
    });
  }

  spacing() {
    return new Paragraph({
      children: [],
      spacing: { line: 20 },
    });
  }

  headerCell({ text = '', size = 10, ...rest }: headerTableProps) {
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
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      margins: { top: 60, bottom: 60 },
      ...rest,
    });
  }
}
