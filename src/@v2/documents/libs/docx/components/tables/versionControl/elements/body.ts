import {
  AlignmentType,
  BorderStyle,
  ITableBordersOptions,
  ITableCellOptions,
  TableCell,
  TableRow,
  VerticalAlign,
  WidthType,
} from 'docx';
import { paragraphNewNormal } from '../../../../base/elements/paragraphs';
import { palette } from '../../../../constants/palette';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  text: string;
  size?: number;
}

export const borderStyle: ITableBordersOptions = {
  top: {
    style: BorderStyle.SINGLE,
    size: 1,
    color: palette.table.rowDark.string,
  },
  bottom: {
    style: BorderStyle.SINGLE,
    size: 1,
    color: palette.table.rowDark.string,
  },
  left: {
    style: BorderStyle.SINGLE,
    size: 1,
    color: palette.table.rowDark.string,
  },
  insideVertical: {
    style: BorderStyle.SINGLE,
    size: 1,
    color: palette.table.rowDark.string,
  },
  insideHorizontal: {
    style: BorderStyle.SINGLE,
    size: 1,
    color: palette.table.rowDark.string,
  },
  right: {
    style: BorderStyle.SINGLE,
    size: 1,
    color: palette.table.rowDark.string,
  },
};

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
      cantSplit: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tableCell({ text, size = 10, ...rest }: bodyTableProps) {
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
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      borders: borderStyle,
      ...rest,
    });
  }
}
