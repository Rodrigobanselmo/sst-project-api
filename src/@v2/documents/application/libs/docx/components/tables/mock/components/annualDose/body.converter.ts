import { AlignmentType } from 'docx';
import { palette } from '../../../../../constants/palette';
import { bodyTableProps } from '../../elements/body';
import { borderStyleGlobal } from '../../../../../base/config/styles';
import { rowBody } from './data/body';

export const NewBody = () => {
  const rows: bodyTableProps[][] = [];

  rowBody.map((row, index) => {
    const cells: bodyTableProps[] = [];

    if (row.length == 4)
      cells[0] = {
        text: row[0],
        alignment: AlignmentType.CENTER,
        shading: { fill: palette.table.header.string },
        margins: { top: 60, bottom: 60, left: 50 },
        rowSpan: index == 1 ? 3 : undefined,
        borders: borderStyleGlobal(palette.common.white.string, {
          right: { size: 15 } as any,
        }),
      };

    cells[row.length - 3] = {
      text: row[row.length - 3],
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      alignment: AlignmentType.CENTER,
      borders: borderStyleGlobal(palette.common.white.string),
    };

    cells[row.length - 2] = {
      text: row[row.length - 2],
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      alignment: AlignmentType.CENTER,
      borders: borderStyleGlobal(palette.common.white.string),
    };

    cells[row.length - 1] = {
      text: row[row.length - 1],
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      alignment: AlignmentType.CENTER,
      borders: borderStyleGlobal(palette.common.white.string),
    };

    rows.push(cells);
  });

  return rows;
};
