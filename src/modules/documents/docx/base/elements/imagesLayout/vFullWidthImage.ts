import { ImageRun, IParagraphOptions, Paragraph } from 'docx';
import fs from 'fs';

import { paragraphFigure } from '../paragraphs';

const fullWidth = 718 * 0.8;

export const VFullWidthImage = (
  image: string,
  text: string,
  options?: IParagraphOptions,
) => {
  return [
    new Paragraph({
      children: [
        new ImageRun({
          data: fs.readFileSync(image),
          transformation: {
            width: fullWidth * (9 / 16),
            height: fullWidth,
          },
        }),
      ],
      ...options,
    }),
    paragraphFigure(text),
  ].filter((i) => i);
};
