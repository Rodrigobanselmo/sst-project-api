import {
  BorderStyle,
  HeightRule,
  ITableBordersOptions,
  ITableCellOptions,
  Paragraph,
  TableCell,
  TableRow,
  VerticalAlign,
  WidthType
} from 'docx';

import { palette } from '../../../../constants/palette';
import { borderNoneStyle } from './../../../../base/config/styles';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  data: Paragraph[];
  empty?: boolean;
}

export const borderStyle: ITableBordersOptions = {
  ...borderNoneStyle,
  top: {
    style: BorderStyle.SINGLE,
    size: 4,
    color: palette.common.black.string,
  },
};

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
      cantSplit: true,
      height: { rule: HeightRule.ATLEAST, value: 1500 },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tableCell({ data, empty, ...rest }: bodyTableProps) {
    return new TableCell({
      children: [...data],
      margins: { top: 60, bottom: 60 },
      verticalAlign: VerticalAlign.TOP,
      borders: !empty ? borderStyle : borderNoneStyle,
      width: { size: 20, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
