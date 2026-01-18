import sizeOf from 'image-size';
import {
  AlignmentType,
  BorderStyle,
  Header,
  ImageRun,
  ITableBordersOptions,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { readFileSync } from 'fs';
import { setNiceProportion } from '../../../helpers/set-nice-proportion';

interface IHeaderProps {
  path: string;
}

const borderStyle: ITableBordersOptions = {
  top: { style: BorderStyle.NIL, size: 0 },
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

const firstCell = (path?: string) => {
  const getProportion = () => {
    const { height: imgHeight, width: imgWidth } = sizeOf(readFileSync(path!));

    const maxWidth = 100;
    const maxHeight = 25;

    const { height, width } = setNiceProportion(maxWidth, maxHeight, imgWidth || 0, imgHeight || 0);
    return { height, width };
  };

  const image = path
    ? new ImageRun({
      data: readFileSync(path),
      transformation: getProportion(),
    } as any)
    : undefined;

  return new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: image ? [image] : [],
      } as any),
    ],
  });
};

const secondCell = () =>
  new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
          } as any),
        ],
        alignment: AlignmentType.END,
        spacing: { after: 0, before: 0 },
      } as any),
    ],
  });

const row = (path: string) =>
  new TableRow({
    children: [firstCell(path), secondCell()],
  });

export const createHeader = ({ path }: IHeaderProps) => {
  const header = {
    default: new Header({
      children: [table([row(path)])],
    } as any),
    first: new Header({
      children: [],
    } as any),
  };

  return header;
};
