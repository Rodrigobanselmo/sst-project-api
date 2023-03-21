import { AlignmentType, ExternalHyperlink, IParagraphOptions, IRunOptions, PageBreak, Paragraph, SequentialIdentifier, TextRun, UnderlineType } from 'docx';
import { rgbStringToHex, rgbToHex } from '../../../../../shared/utils/rgbToHex';
import { isOdd } from '../../../../../shared/utils/isOdd';
import { IEntityRange, IInlineStyleRange, InlineStyleTypeEnum } from '../../builders/pgr/types/elements.types';
import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import sortArray from 'sort-array';

interface ParagraphProps extends IParagraphOptions {
  break?: boolean;
  sequentialIdentifier?: SequentialIdentifier;
  size?: number;
  align?: AlignmentType;
  isBold?: boolean;
  isSuper?: boolean;
  isBreak?: boolean;
  color?: string;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

const getStyle = (range: IInlineStyleRange): Writeable<Partial<IRunOptions>> => {
  const style: Writeable<Partial<IRunOptions>> = {};
  switch (range.style) {
    case InlineStyleTypeEnum.BOLD:
      style.bold = true;
      break;
    case InlineStyleTypeEnum.ITALIC:
      style.italics = true;
      break;
    case InlineStyleTypeEnum.UNDERLINE:
      style.underline = { type: UnderlineType.SINGLE };
      break;
    case InlineStyleTypeEnum.SUPERSCRIPT:
      style.superScript = true;
      break;
    case InlineStyleTypeEnum.SUBSCRIPT:
      style.subScript = true;
      break;
    case InlineStyleTypeEnum.FONTSIZE: {
      if (range.value) style.size = Number(range.value) * 2;
      break;
    }
    case InlineStyleTypeEnum.COLOR: {
      style.color = rgbStringToHex(range.value);
      break;
    }
    case InlineStyleTypeEnum.BG_COLOR: {
      style.shading = { fill: rgbStringToHex(range.value) };
      break;
    }
    default:
      break;
  }
  return style;
};

export const paragraphNormal = (text: string, { children, color, ...options } = {} as ParagraphProps) =>
  new Paragraph({
    children: [
      ...(children || []),
      ...text
        .split('**')
        .map((text, index) => {
          const isBold = isOdd(index);
          return text
            .split('^^')
            .map((text, index) => {
              const isSuper = isOdd(index);
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
                        superScript: isSuper,
                        break: isBreak ? 1 : 0,
                        size: options?.size ? options?.size * 2 : undefined,
                        ...(color ? { color: color } : {}),
                      });
                    if (isLink)
                      return textLink(text, {
                        isBold,
                        isBreak,
                        isSuper,
                        size: options?.size,
                      });
                  });
                })
                .reduce((acc, curr) => [...acc, ...curr], []);
            })
            .reduce((acc, curr) => [...acc, ...curr], []);
        })
        .reduce((acc, curr) => [...acc, ...curr], []),
    ],
    spacing: { line: 350 },
    alignment: options?.align || AlignmentType.JUSTIFIED,
    ...options,
  });

export const getParagraphNormal = (text: string) =>
  text
    .split('**')
    .map((text, index) => {
      const isBold = isOdd(index);
      return text
        .split('^^')
        .map((text, index) => {
          const isSuper = isOdd(index);
          return text
            .split('\n')
            .map((text, index) => {
              const isBreak = index != 0;
              return text.split('<link>').map((text, index) => {
                const isLink = isOdd(index);
                return {
                  isLink: isLink,
                  text: text,
                  ...(isBold && { bold: isBold }),
                  ...(isSuper && { superScript: isSuper }),
                  ...(isBreak && { break: isBreak ? 1 : 0 }),
                };
              });
            })
            .reduce((acc, curr) => [...acc, ...curr], []);
        })
        .reduce((acc, curr) => [...acc, ...curr], []);
    })
    .reduce((acc, curr) => [...acc, ...curr], []);

export const paragraphNewNormal = (text: string, { children, color, ...options } = {} as ParagraphProps) =>
  new Paragraph({
    children: [
      ...(children || []),
      ...text
        .split('\n')
        .map((text, index) => {
          const entityRange = options.entityRangeBlock?.[index] || [];
          const inlineStyleRange = options.inlineStyleRangeBlock?.[index] || [];

          const ranges = { 0: null, [text.length]: null };

          inlineStyleRange.forEach((s) => {
            ranges[s.offset] = null;
            ranges[s.offset + s.length] = null;
          });

          entityRange.forEach((s) => {
            ranges[s.offset] = null;
            ranges[s.offset + s.length] = null;
          });

          const arrayRange = Object.keys(ranges).sort(function (a, b) {
            return Number(a) - Number(b);
          });

          const textRuns: (TextRun | ExternalHyperlink)[] = [];
          console.log('arrayRange', arrayRange);
          arrayRange.forEach((key, index) => {
            const nextKey = arrayRange[index + 1];
            const filter = [...entityRange, ...inlineStyleRange].filter((s) => s.offset <= Number(key) && s.length + s.offset >= Number(nextKey));
            if (nextKey) {
              const offset = Number(key);
              const offsetEnd = Number(nextKey);

              let link = '';
              const styles: Partial<IRunOptions> = {};

              filter.forEach((inline) => {
                if ('data' in inline) {
                  if (inline.data?.type === 'LINK') link = inline.data?.data?.url;
                  return;
                }

                if ('style' in inline) {
                  const style = getStyle(inline);
                  Object.assign(styles, style);
                }
              });

              if (!link) {
                const textValue = text.substring(offset, offsetEnd);
                const paragraphNormal = getParagraphNormal(textValue);

                paragraphNormal.forEach(({ isLink, text, ...item }) => {
                  if (!isLink) {
                    const textRun = new TextRun({
                      text,
                      size: options?.size ? options?.size * 2 : undefined,
                      ...(color ? { color: color } : {}),
                      ...styles,
                      ...item,
                    });

                    textRuns.push(textRun);
                  }

                  if (isLink) {
                    const textRun = new ExternalHyperlink({
                      children: [
                        new TextRun({
                          text,
                          size: options?.size ? options?.size * 2 : undefined,
                          ...(color ? { color: color } : {}),
                          ...styles,
                          ...item,
                          style: 'Hyperlink',
                        }),
                      ],
                      link: link,
                    });

                    textRuns.push(textRun);
                  }
                });

                return;
              }

              if (link) {
                const textRun = new ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: text.substring(offset, offsetEnd),
                      size: options?.size ? options?.size * 2 : undefined,
                      ...(color ? { color: color } : {}),
                      ...styles,
                      style: 'Hyperlink',
                    }),
                  ],
                  link: link,
                });

                textRuns.push(textRun);
                return;
              }
            }
          });

          return textRuns;
        })
        .flat(1),
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
        superScript: options?.isSuper ? options?.isSuper : undefined,
        break: options?.isBreak ? 1 : undefined,
        size: options?.size ? options?.size * 2 : undefined,
        style: 'Hyperlink',
      }),
    ],
    link: link[0],
  });
};

export const paragraphTable = (text: string, options = {} as ParagraphProps) =>
  paragraphNewNormal(text, {
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

export const paragraphTableLegend = (text: string, options = {} as ParagraphProps) =>
  paragraphNewNormal(text, {
    spacing: { after: 300 },
    size: 8,
    align: AlignmentType.START,
    ...options,
  });

export const paragraphFigure = (text: string, options = {} as ParagraphProps & { spacingAfter?: number }) =>
  text
    ? paragraphNewNormal(text, {
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
