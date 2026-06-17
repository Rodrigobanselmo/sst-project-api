import {
  AlignmentType,
  HeightRule,
  Paragraph,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';

import { palette } from '../../../constants/palette';
import { borderStyle } from './elements/body';

export function versionControlValidityRow(validity: string): TableRow {
  return new TableRow({
    height: { value: 280, rule: HeightRule.EXACT },
    children: [
      new TableCell({
        columnSpan: 6,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: ` VIGÊNCIA: ${validity}`,
                size: 16,
                color: palette.text.main.string,
              }),
            ],
            spacing: { before: 0, after: 0, line: 200 },
            alignment: AlignmentType.LEFT,
          }),
        ],
        shading: { fill: palette.table.header.string },
        verticalAlign: VerticalAlign.CENTER,
        borders: borderStyle,
        width: { size: 100, type: WidthType.PERCENTAGE },
      }),
    ],
  });
}
