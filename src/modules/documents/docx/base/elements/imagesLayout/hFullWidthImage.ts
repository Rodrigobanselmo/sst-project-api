import { ImageRun, IParagraphOptions, Paragraph } from 'docx';
import { readFileSync } from 'fs';

import { paragraphFigure } from '../paragraphs';

const fullWidth = 718;

export const HFullWidthImage = (image: string, text: string, options?: IParagraphOptions) => {
  return [
    new Paragraph({
      children: [
        new ImageRun({
          data: readFileSync(image),
          transformation: {
            width: fullWidth,
            height: fullWidth * (9 / 16),
          },
        }),
      ],
      spacing: { after: 100 },
      ...options,
    }),
    paragraphFigure(text, {
      spacingAfter: 200,
    }),
  ].filter((i) => i);
};
