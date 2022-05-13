import {
  AlignmentType,
  Paragraph,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { palette } from 'src/shared/constants/palette';

export interface bodyTableProps {
  text: string;
  size?: number;
}

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
    });
  }

  tableCell({ text, size = 10, ...rest }: bodyTableProps) {
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
              alignment: AlignmentType.CENTER,
            }),
        ),
      ],
      margins: { top: 60, bottom: 60 },
      shading: { fill: palette.table.row.string },
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
