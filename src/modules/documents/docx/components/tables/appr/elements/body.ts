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
import { palette } from '../../../../../../../shared/constants/palette';
import { RISK_INVENTORY_DEFAULT_CONTENT_FONT_PT } from '@/@v2/documents/libs/docx/components/tables/appr/risk-inventory-typography.constant';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  text: string;
  title?: string;
  color?: string;
  borderNone?: boolean;
  bold?: boolean;
  size?: number;
  spacing?: ISpacingProperties;
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  /** Texto na vertical (conteúdo curto: Tipo, RO, etc.). */
  isVertical?: boolean;
  /** Tamanho da fonte do conteúdo em pontos (pt). Padrão: 6pt. */
  fontSizePt?: number;
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
    fontSizePt,
    ...rest
  }: bodyTableProps) {
    const tex = text || '';
    const cellAlignment = isVertical ? AlignmentType.CENTER : alignment;
    const contentFontHalfPoints = (fontSizePt ?? RISK_INVENTORY_DEFAULT_CONTENT_FONT_PT) * 2;
    const titleFontHalfPoints = RISK_INVENTORY_DEFAULT_CONTENT_FONT_PT * 2;

    return new TableCell({
      children: [
        ...tex.split('\n').map((value) => {
          const children = [
            new TextRun({
              text: value,
              size: contentFontHalfPoints,
              color: color || palette.text.main.string,
              bold: !!bold,
            }),
          ];

          if (title)
            children.push(
              new TextRun({
                text: title + ' ',
                size: titleFontHalfPoints,
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
