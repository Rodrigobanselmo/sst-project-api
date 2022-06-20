import {
  AlignmentType,
  BorderStyle,
  Footer,
  ITableBordersOptions,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { palette } from '../../../../../shared/constants/palette';

interface IFooterProps {
  chapter: string;
  version: string;
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

const firstCell = (chapter: string, version: string) =>
  new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: 'PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR',
            size: 12,
            color: palette.text.main.string,
          }),
        ],
        alignment: AlignmentType.START,
        spacing: { after: 0, before: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: chapter,
            size: 12,
            color: palette.text.main.string,
          }),
        ],
        alignment: AlignmentType.START,
        spacing: { after: 0, before: 0 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: version,
            size: 12,
            color: palette.text.main.string,
          }),
        ],
        alignment: AlignmentType.START,
        spacing: { after: 0, before: 0 },
      }),
    ],
  });

const secondCell = () =>
  new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: 'SIMPLE',
            size: 42,
            color: palette.text.main.string,
          }),
          new TextRun({
            text: 'SST',
            size: 42,
            color: palette.text.simple.string,
          }),
        ],
        alignment: AlignmentType.END,
        spacing: { after: 0, before: 0 },
      }),
    ],
  });

const row = (chapter: string, version: string) =>
  new TableRow({
    children: [firstCell(chapter, version), secondCell()],
  });

export const createFooter = ({ chapter, version }: IFooterProps) => {
  const footer = {
    default: new Footer({
      children: [table([row(chapter, version)])],
    }),
    first: new Footer({
      children: [],
    }),
  };

  return footer;
};
