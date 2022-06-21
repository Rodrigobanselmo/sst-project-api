import {
  AlignmentType,
  IParagraphOptions,
  PageBreak,
  Paragraph,
  TextRun,
} from 'docx';

function isOdd(num: number) {
  return num % 2 === 0 ? false : true;
}

export const paragraphNormal = (
  text: string,
  options?: IParagraphOptions & { break?: boolean },
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
