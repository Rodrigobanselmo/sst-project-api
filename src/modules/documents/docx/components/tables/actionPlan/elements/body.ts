import { AlignmentType, Paragraph, TableCell, TableRow, TextDirection, TextRun, VerticalAlign, WidthType } from 'docx';
import { palette } from '../../../../../../../shared/constants/palette';

export interface bodyTableProps {
  text: string;
  size?: number;
  isVertical?: boolean;
  color?: string;
  fontSize?: number;
  borders: any;
}

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
    });
  }

  tableCell({
    text,
    size = 10,
    isVertical = false,
    color = palette.text.main.string,
    fontSize = 5,
    ...rest
  }: bodyTableProps) {
    return new TableCell({
      children: [
        ...text.split('\n').map(
          (value) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: value,
                  size: fontSize * 2,
                  color,
                }),
              ],
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
      textDirection: isVertical ? TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT : undefined,
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
