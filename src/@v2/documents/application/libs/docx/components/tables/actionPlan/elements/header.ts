import { borderStyleGlobal } from './../../../../base/config/styles';
import {
  AlignmentType,
  HeightRule,
  Paragraph,
  TableCell,
  TableRow,
  TextDirection,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { palette } from '../../../../constants/palette';

export interface headerTableProps {
  text: string;
  size?: number;
  position?: number;
  borders: any;
}

export class TableHeaderElements {
  headerTitle(title: string[], columnSpan: number) {
    return new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          children: [
            ...title.map(
              (value) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: value,
                      size: 20,
                      bold: true,
                      color: '000000',
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
          shading: { fill: palette.table.header.string },
          verticalAlign: VerticalAlign.CENTER,
          columnSpan,
          margins: { top: 150, bottom: 150 },
          borders: borderStyleGlobal(palette.common.white.string),
        }),
      ],
    });
  }

  headerRow(tableCell: TableCell[]) {
    return new TableRow({
      height: { value: 1600, rule: HeightRule.EXACT },
      tableHeader: true,
      children: [...tableCell],
    });
  }

  headerCell({ text, size = 10, ...rest }: headerTableProps) {
    return new TableCell({
      children: [
        ...text.split('\n').map(
          (value) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: value,
                  size: 12,
                  bold: true,
                  color: palette.text.main.string,
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
      shading: { fill: palette.table.header.string },
      textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      ...rest,
    });
  }
}
