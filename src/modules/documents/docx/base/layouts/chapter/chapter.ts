import { setNiceProportion } from './../../../../../../shared/utils/setNiceProportion';
import { AlignmentType, Footer, Header, HeightRule, ImageRun, ISectionOptions, Paragraph, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';
import fs from 'fs';
import sizeOf from 'image-size';
import { borderNoneStyle, sectionCoverProperties } from '../../config/styles';

interface IChapterProps {
  version: string;
  chapter: string;
  imagePath: string;
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

const imageCover = (imgPath: string, verticalAlign: VerticalAlign) => {
  const { height: imgHeight, width: imgWidth } = sizeOf(fs.readFileSync(imgPath));

  const maxWidth = 630;
  const maxHeight = 200;

  const { height, width } = setNiceProportion(maxWidth, maxHeight, imgWidth, imgHeight);

  return new TableCell({
    width: { size: 100, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync(imgPath),
            transformation: {
              width,
              height,
            },
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
    verticalAlign,
  });
};

export const createChapterPage = ({ version, chapter, imagePath }: IChapterProps) => {
  return table([
    new TableRow({
      children: [text('PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR', VerticalAlign.TOP)],
      height: { value: 1500, rule: HeightRule.EXACT },
    }),
    ...(imagePath
      ? [
          new TableRow({
            children: [imageCover(imagePath, VerticalAlign.CENTER)],
            height: { value: 3000, rule: HeightRule.EXACT },
          }),
        ]
      : []),
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

export const chapterSection = ({ version, chapter, imagePath }: IChapterProps): ISectionOptions => {
  return {
    children: [createChapterPage({ version, chapter, imagePath })],
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
