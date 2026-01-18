import { ImageRun, Paragraph, Table, TableCell, TableRow, VerticalAlign, WidthType } from 'docx';
import { readFileSync } from 'fs';

import { borderNoneStyle } from '../../config/styles';
import { paragraphFigure } from '../paragraphs';

const fullWidth = 718;
const width = fullWidth / 3 - 10;

export const VThreeImages = (
  images: [string, string, string],
  texts: [string, string, string],
  removeLegend?: boolean,
) => {
  if (texts[0] == texts[1]) {
    if (texts[1] == texts[2]) {
      texts[2] = '';
    }
    texts[1] = '';
  }

  if (texts[1] == texts[2]) {
    texts[2] = '';
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
                        width: width,
                        height: width * (16 / 9),
                      },
                    } as any),
                  ],
                  spacing: { after: 32 },
                } as any),
              ],
              width: {
                size: 33,
                type: WidthType.PERCENTAGE,
              },
              margins: { bottom: 0, right: 10 },
            } as any),
            new TableCell({
              children: [
                new Paragraph({
                  children: images[1]
                    ? [
                      new ImageRun({
                        data: readFileSync(images[1]),
                        transformation: {
                          width: width,
                          height: width * (16 / 9),
                        },
                      } as any),
                    ]
                    : [],
                  spacing: { after: 32 },
                } as any),
              ],
              width: {
                size: 33,
                type: WidthType.PERCENTAGE,
              },
              margins: { bottom: 0 },
              verticalAlign: VerticalAlign.BOTTOM,
            } as any),
            new TableCell({
              children: [
                new Paragraph({
                  children: images[2]
                    ? [
                      new ImageRun({
                        data: readFileSync(images[2]),
                        transformation: {
                          width: width,
                          height: width * (16 / 9),
                        },
                      } as any),
                    ]
                    : [],
                  spacing: { after: 32 },
                } as any),
              ],
              width: {
                size: 33,
                type: WidthType.PERCENTAGE,
              },
              margins: { bottom: 0 },
            } as any),
          ],
        } as any),
        new TableRow({
          children: [
            new TableCell({
              children: [paragraphFigure(texts[0])].filter((i) => i) as Paragraph[],
            } as any),
            new TableCell({
              children: [paragraphFigure(texts[1])].filter((i) => i) as Paragraph[],
            } as any),
            new TableCell({
              children: [paragraphFigure(texts[2])].filter((i) => i) as Paragraph[],
            } as any),
          ],
        } as any),
      ],
      borders: borderNoneStyle,
    } as any),
  ];
};
