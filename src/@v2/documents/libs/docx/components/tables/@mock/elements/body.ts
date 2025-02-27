import { textLink } from '../../../../base/elements/paragraphs';
import {
  AlignmentType,
  ITableCellOptions,
  ITableRowOptions,
  Paragraph,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { palette } from '../../../../constants/palette';
import { isOdd } from '@/@v2/shared/utils/helpers/is-odd';

export interface bodyTableProps extends Partial<ITableCellOptions> {
  text: string;
  color?: string;
  size?: number;
  textSize?: number;
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
}

export class TableBodyElements {
  tableRow(tableCell: TableCell[], rowOptions?: Partial<ITableRowOptions>) {
    return new TableRow({
      children: [...tableCell],
      cantSplit: true,
      ...rowOptions,
    });
  }

  tableCell({ text, size = 10, alignment, ...rest }: bodyTableProps) {
    return new TableCell({
      children: [
        ...text.split('\n').map(
          (text) =>
            new Paragraph({
              children: [
                ...text
                  .split('**')
                  .map((text, index) => {
                    const isBold = isOdd(index);
                    return text
                      .split('\n')
                      .map((text, index) => {
                        const isBreak = index != 0;
                        return text.split('<link>').map((text) => {
                          const isLink = isOdd(index);
                          if (!isLink)
                            return new TextRun({
                              text: text,
                              bold: isBold,
                              break: isBreak ? 1 : 0,
                              size: rest?.textSize ? rest?.textSize * 2 : 12,
                              color: rest?.color ? rest?.color : undefined,
                            });

                          return textLink(text, {
                            isBold,
                            isBreak,
                            size: rest?.textSize ? rest?.textSize * 2 : 12,
                          });
                        });
                      })
                      .reduce((acc, curr) => [...acc, ...curr], []);
                  })
                  .reduce((acc, curr) => [...acc, ...curr], []),
              ],
              spacing: {
                before: 0,
                after: 0,
              },
              alignment,
            }),
        ),
      ],
      margins: { top: 60, bottom: 60 },
      verticalAlign: VerticalAlign.CENTER,
      width: { size, type: WidthType.PERCENTAGE },
      borders: borderStyleGlobal(palette.table.rowDark.string),
      ...rest,
    });
  }
}
