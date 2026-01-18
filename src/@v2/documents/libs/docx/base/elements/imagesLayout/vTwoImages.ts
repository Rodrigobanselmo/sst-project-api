import { ImageRun, Paragraph, Table, TableCell, TableRow, VerticalAlign, WidthType } from 'docx';
import { readFileSync } from 'fs';

import { borderNoneStyle } from '../../config/styles';
import { paragraphFigure } from '../paragraphs';

const fullWidth = 718;

export const VTwoImages = (images: [string, string], texts: [string, string], removeLegend?: boolean) => {
  if (texts[0] == texts[1]) {
    texts[1] = '';
  }

  if (removeLegend) {
    texts[0] = '';
  }

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: readFileSync(images[0]),
                      transformation: {
                        width: fullWidth / 2 - 5,
                        height: (fullWidth / 2 - 5) * (16 / 9),
                      },
                    } as any),
                  ],
                  spacing: { after: 32 },
                } as any),
              ],
              width: {
                size: ((fullWidth / 2 - 5) / fullWidth) * 100,
                type: WidthType.PERCENTAGE,
              },
              margins: { bottom: 0 },
            } as any),
            new TableCell({
              children: [],
              width: { size: 10, type: WidthType.PERCENTAGE },
              margins: { bottom: 0 },
            } as any),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: readFileSync(images[1]),
                      transformation: {
                        width: fullWidth / 2 - 5,
                        height: (fullWidth / 2 - 5) * (16 / 9),
                      },
                    } as any),
                  ],
                  spacing: { after: 32 },
                } as any),
              ],
              width: {
                size: 100 - ((fullWidth / 2 - 5) / fullWidth) * 100,
                type: WidthType.PERCENTAGE,
              },
              margins: { bottom: 0 },
              verticalAlign: VerticalAlign.BOTTOM,
            } as any),
          ],
        } as any),
        new TableRow({
          children: [
            new TableCell({
              children: [paragraphFigure(texts[0])].filter((i) => i) as Paragraph[],
              width: { size: 45, type: WidthType.PERCENTAGE },
            } as any),
            new TableCell({
              children: [],
              width: { size: 10, type: WidthType.PERCENTAGE },
            } as any),
            new TableCell({
              children: [paragraphFigure(texts[1])].filter((i) => i) as Paragraph[],
              width: { size: 45, type: WidthType.PERCENTAGE },
            } as any),
          ],
        } as any),
      ],
      borders: borderNoneStyle,
    } as any),
  ];
};
