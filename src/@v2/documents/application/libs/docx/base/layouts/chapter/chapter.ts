import {
  AlignmentType,
  Footer,
  Header,
  HeightRule,
  ImageRun,
  ISectionOptions,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { readFileSync } from 'fs';
import sizeOf from 'image-size';
import { borderNoneStyle, sectionCoverProperties } from '../../config/styles';
import { setNiceProportion } from '../../../helpers/set-nice-proportion';

interface IChapterProps {
  version: string;
  chapter: string;
  title: string;
  imagePath?: string | null;
}

const text = (text: string, verticalAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign]) =>
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

const imageCover = (imgPath: string, verticalAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign]) => {
  const { height: imgHeight, width: imgWidth } = sizeOf(readFileSync(imgPath));

  const maxWidth = 630;
  const maxHeight = 200;

  const { height, width } = setNiceProportion(maxWidth, maxHeight, imgWidth || 0, imgHeight || 0);

  return new TableCell({
    width: { size: 100, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: readFileSync(imgPath),
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

export const createChapterPage = ({ version, chapter, imagePath, title }: IChapterProps) => {
  return table([
    new TableRow({
      children: [text(title, VerticalAlign.TOP)],
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

export const chapterSection = ({ version, chapter, imagePath, title }: IChapterProps): ISectionOptions => {
  return {
    children: [createChapterPage({ version, chapter, imagePath, title })],
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
