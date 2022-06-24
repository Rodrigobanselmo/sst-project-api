import { AlignmentType } from 'docx';
import { palette } from '../../../../../../../shared/constants/palette';
import { bodyTableProps } from '../elements/body';
import { borderStyle } from '../../../../base/config/styles';

export const NewBody = (body: [string, string[][], string][]) => {
  const rows: bodyTableProps[][] = [];

  body.map((row) => {
    const cells1: bodyTableProps[] = [];
    const cells2: bodyTableProps[] = [];

    cells1[0] = {
      text: row[0],
      alignment: AlignmentType.CENTER,
      shading: { fill: palette.table.header.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyle(palette.common.white.string, {
        right: { size: 15 } as any,
      }),
      rowSpan: 2,
    };
    cells1[1] = {
      text: row[1][0].join('\n'),
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyle(palette.common.white.string),
    };

    cells1[3] = {
      text: row[2],
      shading: { fill: palette.table.header.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyle(palette.common.white.string, {
        left: { size: 15 } as any,
      }),
      rowSpan: 2,
      alignment: AlignmentType.CENTER,
    };

    rows.push(cells1);

    cells2[0] = {
      text: row[1][1].join('\n'),
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyle(palette.common.white.string),
    };

    rows.push(cells2);
  });

  return rows;
};
