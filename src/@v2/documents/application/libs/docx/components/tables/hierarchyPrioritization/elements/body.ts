import {
  AlignmentType,
  ITableCellOptions,
  Paragraph,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { palette } from '../../../../../../../shared/constants/palette';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  text?: string;
  size?: number;
  attention?: boolean;
  shaded?: boolean;
}

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
    });
  }

  tableCell({ text, attention, shaded, size = 1, ...rest }: bodyTableProps) {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text || '',
              size: 12,
              color: attention ? palette.text.attention.string : palette.text.main.string,
              bold: !!attention,
            }),
          ],
          spacing: {
            before: 0,
            after: 0,
          },
          alignment: AlignmentType.CENTER,
        }),
      ],
      margins: { top: 20, bottom: 20 },
      shading: shaded ? { fill: palette.table.attention.string } : { fill: palette.table.row.string },
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
