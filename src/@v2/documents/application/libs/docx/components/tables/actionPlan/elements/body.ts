import { AlignmentType, Paragraph, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';
import { palette } from '../../../../constants/palette';
import { paragraphNewNormal } from '../../../../base/elements/paragraphs';

export interface bodyTableProps {
  text: string;
  size?: number;
  borders: any;
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
      shading: { fill: palette.table.row.string },
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
