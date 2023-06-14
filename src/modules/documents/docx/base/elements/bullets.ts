import { IParagraphOptions, Paragraph } from 'docx';

import { paragraphNewNormal } from './paragraphs';

export const bulletsNormal = (text: string, level: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0, options?: IParagraphOptions) => {
  return paragraphNewNormal(text, {
    bullet: {
      level,
    },
    spacing: { line: 350, after: 80, before: 0 },
    ...options,
  });
};

export const bulletsSpace = (text: string, options?: IParagraphOptions) => {
  return paragraphNewNormal(`         ${text}`, {
    spacing: { line: 250, after: 80, before: 0 },
    ...options,
  });
};

export const bulletsArray = (bullets: [string, number?][], options?: IParagraphOptions) => {
  return bullets.map(([text, level]) =>
    paragraphNewNormal(text, {
      bullet: {
        level: level || 0,
      },
      spacing: { line: 350, after: 80, before: 0 },
      ...options,
    }),
  );
};

export const bulletsMoreLevels = (bullets: string[][] | string[], options?: IParagraphOptions) => {
  return bullets
    .map((text: string[] | string): Paragraph[] => {
      if (Array.isArray(text)) {
        return text.map((line, index) => {
          return paragraphNewNormal(line, {
            bullet: {
              level: index === 0 ? 0 : 1,
            },
            ...options,
          });
        });
      }

      if (typeof text === 'string') {
        return [
          paragraphNewNormal(text, {
            bullet: {
              level: 0,
            },
            ...options,
          }),
        ] as Paragraph[];
      }
    })
    .reduce((acc, array) => {
      return [...acc, ...array];
    }, [] as Paragraph[]);
};
