import { AlignmentType, BorderStyle, ITableCellOptions, Paragraph, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';
import { palette } from '../../../../../../../shared/constants/palette';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  text?: string;
  size?: number;
  employee?: string;
  description?: string;
}

export const borderNoneStyle = {
  // top: { style: BorderStyle.NIL, size: 0 },
  // bottom: { style: BorderStyle.NIL, size: 0 },
};

export const emptyCellName = ' ';

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
      cantSplit: true,
    });
  }

  tableCell({ text, size = 1, ...rest }: bodyTableProps) {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text || '',
              size: 12,
              color: palette.text.main.string,
            }),
          ],
          spacing: {
            before: 0,
            after: 0,
          },
          alignment: AlignmentType.CENTER,
        }),
      ],
      ...(text == emptyCellName ? { borders: borderNoneStyle } : {}),
      margins: { top: 20, bottom: 20 },
      shading: { fill: palette.table.row.string },
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
