import { AlignmentType } from 'docx';
import { palette } from '../../../../../../../../shared/constants/palette';
import { bodyTableProps } from '../../elements/body';
import { borderStyleGlobal } from '../../../../../base/config/styles';

export const NewBody = (body: [string, string, string, string][]) => {
  const rows: bodyTableProps[][] = [];

  body.map((row) => {
    const cells1: bodyTableProps[] = [];

    cells1[0] = {
      text: row[0],
      alignment: AlignmentType.CENTER,
      shading: { fill: palette.table.header.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyleGlobal(palette.common.white.string, {
        right: { size: 15 } as any,
      }),
    };
    cells1[1] = {
      text: row[1],
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyleGlobal(palette.common.white.string),
      alignment: AlignmentType.CENTER,
    };

    cells1[2] = {
      text: row[2],
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyleGlobal(palette.common.white.string),
      alignment: AlignmentType.CENTER,
    };

    cells1[3] = {
      text: row[3],
      shading: { fill: palette.table.header.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyleGlobal(palette.common.white.string, {
        left: { size: 15 } as any,
      }),
      alignment: AlignmentType.CENTER,
    };

    rows.push(cells1);
  });

  return rows;
};
