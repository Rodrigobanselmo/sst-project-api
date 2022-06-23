import {
  AlignmentType,
  Footer,
  Header,
  HeightRule,
  ISectionOptions,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';

import { borderNoneStyle, sectionCoverProperties } from '../../config/styles';

interface IChapterProps {
  version: string;
  chapter: string;
}

const text = (text: string, verticalAlign: VerticalAlign) =>
  new TableCell({
    width: { size: 100, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            size: 36,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
    verticalAlign,
  });

const table = (rows: TableRow[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    borders: borderNoneStyle,
  });

export const createChapterPage = ({ version, chapter }: IChapterProps) => {
  return table([
    new TableRow({
      children: [
        text('PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR', VerticalAlign.TOP),
      ],
      height: { value: 4500, rule: HeightRule.EXACT },
    }),
    new TableRow({
      children: [text(chapter, VerticalAlign.CENTER)],
      height: { value: 4500, rule: HeightRule.EXACT },
    }),
    new TableRow({
      children: [text(version, VerticalAlign.BOTTOM)],
      height: { value: 4500, rule: HeightRule.EXACT },
    }),
  ]);
};

export const chapterSection = ({
  version,
  chapter,
}: IChapterProps): ISectionOptions => {
  return {
    children: [createChapterPage({ version, chapter })],
    properties: sectionCoverProperties,
    footers: {
      default: new Footer({
        children: [],
      }),
    },
    headers: {
      default: new Header({
        children: [],
      }),
    },
  };
};
