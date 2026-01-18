import {
  AlignmentType,
  BorderStyle,
  Footer,
  ImageRun,
  ITableBordersOptions,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import sizeOf from 'image-size';
import { readFileSync } from 'fs';
import { palette } from '../../../constants/palette';
import { setNiceProportion } from '../../../helpers/set-nice-proportion';

interface IFooterProps {
  footerText: string;
  consultantLogoPath: string;
  version: string;
  title: string;
}
const borderStyle: ITableBordersOptions = {
  top: {
    style: BorderStyle.SINGLE,
    size: 1,
    color: palette.text.simple.string,
  },
  bottom: { style: BorderStyle.NIL, size: 0 },
  left: { style: BorderStyle.NIL, size: 0 },
  insideVertical: { style: BorderStyle.NIL, size: 0 },
  insideHorizontal: { style: BorderStyle.NIL, size: 0 },
  right: { style: BorderStyle.NIL, size: 0 },
};

const table = (rows: TableRow[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    borders: borderStyle,
  });

const firstCell = (title: string, footerText: string, version: string) =>
  new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            size: 12,
            color: palette.text.main.string,
          } as any),
        ],
        alignment: AlignmentType.START,
        spacing: { after: 0, before: 100 },
      } as any),
      new Paragraph({
        children: [
          new TextRun({
            text: footerText,
            size: 12,
            color: palette.text.main.string,
          } as any),
        ],
        alignment: AlignmentType.START,
        spacing: { after: 0, before: 0 },
      } as any),
      new Paragraph({
        children: [
          new TextRun({
            text: version,
            size: 12,
            color: palette.text.main.string,
          } as any),
        ],
        alignment: AlignmentType.START,
        spacing: { after: 0, before: 0 },
      } as any),
    ],
  });

const secondCell = (consultantLogoPath: string) => {
  if (!consultantLogoPath)
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'SIMPLE',
              size: 42,
              color: palette.text.main.string,
              bold: true,
            } as any),
            new TextRun({
              text: 'SST',
              size: 42,
              color: palette.text.simple.string,
              bold: true,
            } as any),
          ],
          alignment: AlignmentType.END,
          spacing: { after: 0, before: 0 },
        } as any),
      ],
    });

  const getProportion = () => {
    const { height: imgHeight, width: imgWidth } = sizeOf(readFileSync(consultantLogoPath));

    const maxWidth = 250;
    const maxHeight = 30;

    const { height, width } = setNiceProportion(maxWidth, maxHeight, imgWidth || 0, imgHeight || 0);
    return { height, width };
  };

  const image = consultantLogoPath
    ? new ImageRun({
      data: readFileSync(consultantLogoPath),
      transformation: getProportion(),
    } as any)
    : undefined;

  return new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: image ? [image] : [],
        alignment: AlignmentType.END,
        spacing: { after: 0, before: 100 },
      } as any),
    ],
    margins: { top: 0 },
  });
};

const row = (title: string, footerText: string, version: string, consultantLogoPath: string) =>
  new TableRow({
    children: [firstCell(title, footerText, version), secondCell(consultantLogoPath)],
  });

export const createFooter = ({ title, footerText, version, consultantLogoPath }: IFooterProps) => {
  const footer = {
    default: new Footer({
      children: [table([row(title, footerText, version, consultantLogoPath)])],
    } as any),
    first: new Footer({
      children: [],
    } as any),
  };

  return footer;
};
