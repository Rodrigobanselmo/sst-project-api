import { AlignmentType, ITableCellOptions, TableCell, TableRow, VerticalAlign, WidthType } from 'docx';
import { paragraphNewNormal } from '../../../../base/elements/paragraphs';
import { palette } from '../../../../constants/palette';

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
        ...text.split('\n').map((value) =>
          paragraphNewNormal(value, {
            size: 6,
            color: palette.text.main.string,
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 0,
              after: 0,
            },
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
