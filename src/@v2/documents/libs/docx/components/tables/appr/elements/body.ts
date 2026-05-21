import {
  AlignmentType,
  BorderStyle,
  ISpacingProperties,
  ITableCellOptions,
  Paragraph,
  TableCell,
  TableRow,
  TextDirection,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { palette } from '../../../../constants/palette';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  text: string;
  title?: string;
  color?: string;
  borderNone?: boolean;
  bold?: boolean;
  size?: number;
  spacing?: ISpacingProperties;
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  isVertical?: boolean;
}

export const borderNoneStyle = {
  top: { style: BorderStyle.NIL, size: 0 },
  bottom: { style: BorderStyle.NIL, size: 0 },
  left: { style: BorderStyle.NIL, size: 0 },
  right: { style: BorderStyle.NIL, size: 0 },
};

export class TableBodyElements {
  tableRow(tableCell: TableCell[]) {
    return new TableRow({
      children: [...tableCell],
    });
  }

  tableCell({
    text = '',
    title,
    size = 10,
    bold,
    spacing = { line: 200 },
    alignment = AlignmentType.LEFT,
    color,
    isVertical = false,
    ...rest
  }: bodyTableProps) {
    const tex = text || '';
    const cellAlignment = isVertical ? AlignmentType.CENTER : alignment;

    return new TableCell({
      children: [
        ...tex.split('\n').map((value) => {
          const children = [
            new TextRun({
              text: value.replaceAll('**', ''),
              size: 12,
              color: color || palette.text.main.string,
              bold: !!bold,
            }),
          ];

          if (title)
            children.push(
              new TextRun({
                text: title + ' ',
                size: 12,
                color: color || palette.text.main.string,
                bold: true,
              }),
            );

          return new Paragraph({
            children: children.reverse(),
            alignment: cellAlignment,
            spacing: {
              before: 0,
              after: 0,
              ...spacing,
            },
          });
        }),
      ],
      margins: isVertical ? { top: 60, bottom: 60 } : { top: 0, bottom: 0 },
      shading: { fill: palette.table.row.string },
      textDirection: isVertical ? TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT : undefined,
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
