import { AlignmentType, IParagraphOptions, Paragraph, TextRun } from 'docx';

function isOdd(num: number) {
  return num % 2 === 0 ? false : true;
}

export const paragraphNormal = (text: string, options?: IParagraphOptions) =>
  new Paragraph({
    children: [
      ...text.split('**').map(
        (text, index) =>
          new TextRun({
            text: text,
            bold: isOdd(index),
          }),
      ),
    ],
    spacing: { line: 350 },
    alignment: AlignmentType.JUSTIFIED,
    ...options,
  });
