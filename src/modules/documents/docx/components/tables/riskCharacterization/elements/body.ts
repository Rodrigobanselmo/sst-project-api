import { AlignmentType, ITableCellOptions, Paragraph, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';
import { palette } from '../../../../../../../shared/constants/palette';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  text: string;
  size?: number;
  type?: string;
  darker?: boolean;
}

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
      cantSplit: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tableCell({ text, size = 10, type: _, darker, ...rest }: bodyTableProps) {
    return new TableCell({
      children: [
        ...text.split('\n').map(
          (value) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: value,
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
        ),
      ],
      margins: { top: 60, bottom: 60 },
      shading: {
        fill: darker ? palette.table.rowDark.string : palette.table.row.string,
      },
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
