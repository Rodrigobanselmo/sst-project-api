import { ImageRun, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { readFileSync } from 'fs';

import { borderNoneStyle } from '../../config/styles';
import { paragraphFigure } from '../paragraphs';

const fullWidth = 718;

export const HOneMiddleImages = (image: string, text: string) => {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [],
                }),
              ],
              width: { size: 27, type: WidthType.PERCENTAGE },
              margins: { bottom: 0 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: readFileSync(image),
                      transformation: {
                        width: fullWidth / 2 - 5,
                        height: 404 / 2,
                      },
                    }),
                  ],
                  spacing: { after: 32 },
                }),
              ],
              width: { size: 46, type: WidthType.PERCENTAGE },
              margins: { bottom: 0 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [],
                }),
              ],
              width: { size: 27, type: WidthType.PERCENTAGE },
              margins: { bottom: 0 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [],
                }),
              ],
              width: { size: 5, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [paragraphFigure(text)].filter((i) => i) as Paragraph[],
              width: { size: 90, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [],
                }),
              ],
              width: { size: 5, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
      borders: borderNoneStyle,
    }),
  ];
};
