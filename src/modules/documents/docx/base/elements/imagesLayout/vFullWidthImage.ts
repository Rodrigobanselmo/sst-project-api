import { ImageRun, IParagraphOptions, Paragraph } from 'docx';
import { readFileSync } from 'fs';

import { paragraphFigure } from '../paragraphs';

const fullWidth = 718 * 0.8;

export const VFullWidthImage = (image: string, text: string, options?: IParagraphOptions) => {
  return [
    new Paragraph({
      children: [
        new ImageRun({
          data: readFileSync(image),
          transformation: {
            width: fullWidth * (9 / 16),
            height: fullWidth,
          },
        } as any),
      ],
      ...options,
    }),
    paragraphFigure(text, { spacingAfter: 200 }),
  ].filter((i) => i);
};
