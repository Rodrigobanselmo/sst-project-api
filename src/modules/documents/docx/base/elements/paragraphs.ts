import {
  AlignmentType,
  ExternalHyperlink,
  IParagraphOptions,
  PageBreak,
  Paragraph,
  SequentialIdentifier,
  TextRun,
} from 'docx';
import { isOdd } from '../../../../../shared/utils/isOdd';

interface ParagraphProps extends IParagraphOptions {
  break?: boolean;
  sequentialIdentifier?: SequentialIdentifier;
  size?: number;
  align?: AlignmentType;
  isBold?: boolean;
  isBreak?: boolean;
}

export const paragraphNormal = (
  text: string,
  { children, ...options } = {} as ParagraphProps,
) =>
  new Paragraph({
    children: [
      ...(children || []),
      ...text
        .split('**')
        .map((text, index) => {
          const isBold = isOdd(index);
          return text
            .split('\n')
            .map((text, index) => {
              const isBreak = index != 0;
              return text.split('<link>').map((text, index) => {
                const isLink = isOdd(index);
                if (!isLink)
                  return new TextRun({
                    text: text,
                    bold: isBold,
                    break: isBreak ? 1 : 0,
                    size: options?.size ? options?.size * 2 : undefined,
                  });
                if (isLink)
                  return textLink(text, {
                    isBold,
                    isBreak,
                    size: options?.size,
                  });
              });
            })
            .reduce((acc, curr) => [...acc, ...curr], []);
        })
        .reduce((acc, curr) => [...acc, ...curr], []),
    ],
    spacing: { line: 350 },
    alignment: options?.align || AlignmentType.JUSTIFIED,
    ...options,
  });

export const pageBreak = () =>
  new Paragraph({
    children: [new PageBreak()],
  });

export const textLink = (text: string, options = {} as ParagraphProps) => {
  const link = text.split('|');

  return new ExternalHyperlink({
    children: [
      new TextRun({
        text: link[1],
        bold: options?.isBold ? options?.isBold : undefined,
        break: options?.isBreak ? 1 : undefined,
        size: options?.size ? options?.size * 2 : undefined,
        style: 'Hyperlink',
      }),
    ],
    link: link[0],
  });
};

export const paragraphTable = (text: string, options = {} as ParagraphProps) =>
  paragraphNormal(text, {
    ...options,
    children: [
      new TextRun({
        text: 'Tabela ',
        size: 16,
      }),
      new TextRun({
        size: 16,
        children: [new SequentialIdentifier('Table')],
      }),
      new TextRun({
        text: ': ',
        size: 16,
      }),
    ],
    size: 8,
    spacing: { after: 70 },
  });

export const paragraphTableLegend = (
  text: string,
  options = {} as ParagraphProps,
) =>
  paragraphNormal(text, {
    ...options,
    size: 8,
    spacing: { after: 300 },
    align: AlignmentType.START,
  });

export const paragraphFigure = (
  text: string,
  options = {} as ParagraphProps & { spacingAfter?: number },
) =>
  text
    ? paragraphNormal(text, {
        ...options,
        children: [
          new TextRun({
            text: 'Figura ',
            size: 16,
          }),
          new TextRun({
            size: 16,
            children: [new SequentialIdentifier('Figure')],
          }),
          new TextRun({
            text: ': ',
            size: 16,
          }),
        ],
        size: 8,
        spacing: { after: options?.spacingAfter ?? 70 },
      })
    : undefined;
