import { ImageRun, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { readFileSync } from 'fs';

import { borderNoneStyle } from '../../config/styles';
import { paragraphFigure } from '../paragraphs';

const fullWidth = 718;

export const HTwoImages = (images: [string, string], texts: [string, string], removeLegend?: boolean) => {
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
                        height: 404 / 2,
                      },
                    }),
                  ],
                  spacing: { after: 32 },
                }),
              ],
              width: { size: 45, type: WidthType.PERCENTAGE },
              margins: { bottom: 0 },
            }),
            new TableCell({
              children: [],
              width: { size: 10, type: WidthType.PERCENTAGE },
              margins: { bottom: 0 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: readFileSync(images[1]),
                      transformation: {
                        width: fullWidth / 2 - 5,
                        height: 404 / 2,
                      },
                    }),
                  ],
                  spacing: { after: 32 },
                }),
              ],
              width: { size: 45, type: WidthType.PERCENTAGE },
              margins: { bottom: 0 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [paragraphFigure(texts[0])].filter((i) => i) as Paragraph[],
              width: { size: 45, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [],
              width: { size: 10, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [paragraphFigure(texts[1])].filter((i) => i) as Paragraph[],
              width: { size: 45, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
      borders: borderNoneStyle,
    }),
  ];
};
