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
import fs from 'fs';

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
  const image = path
    ? new ImageRun({
        data: fs.readFileSync(path),
        transformation: {
          width: 45,
          height: 25,
        },
      })
    : undefined;

  return new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [image],
      }),
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
          }),
        ],
        alignment: AlignmentType.END,
        spacing: { after: 0, before: 0 },
      }),
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
    }),
    first: new Header({
      children: [],
    }),
  };

  return header;
};
