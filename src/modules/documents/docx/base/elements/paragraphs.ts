import {
  AlignmentType,
  IParagraphOptions,
  PageBreak,
  Paragraph,
  TextRun,
} from 'docx';
import { isOdd } from '../../../../../shared/utils/isOdd';

export const paragraphNormal = (
  text: string,
  options?: IParagraphOptions & { break?: boolean; size?: number },
) =>
  new Paragraph({
    children: [
      ...text
        .split('**')
        .map((text, index) => {
          const isBold = isOdd(index);
          return text.split('\n').map((text, index) => {
            const isBreakOne = isOdd(index);
            return new TextRun({
              text: text,
              bold: isBold,
              break: isBreakOne ? 1 : 0,
              size: options?.size ? options?.size * 2 : undefined,
            });
          });
        })
        .reduce((acc, curr) => [...acc, ...curr], []),
    ],
    spacing: { line: 350 },
    alignment: AlignmentType.JUSTIFIED,
    ...options,
  });

export const pageBreak = () =>
  new Paragraph({
    children: [new PageBreak()],
  });
