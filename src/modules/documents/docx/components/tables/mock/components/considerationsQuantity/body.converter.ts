import { AlignmentType } from 'docx';
import { palette } from '../../../../../../../../shared/constants/palette';
import { bodyTableProps } from '../../elements/body';
import { borderStyleGlobal } from '../../../../../base/config/styles';
import { rowBody } from './data/body';

export const NewBody = () => {
  const rows: bodyTableProps[][] = [];

  rowBody.map((row) => {
    const cells: bodyTableProps[] = [];

    cells[0] = {
      text: row[0],
      alignment: AlignmentType.CENTER,
      shading: { fill: palette.table.header.string },
      margins: { top: 60, bottom: 60, left: 50 },
      borders: borderStyleGlobal(palette.common.white.string, {
        right: { size: 15 } as any,
      }),
    };

    cells[1] = {
      text: row[1],
      shading: { fill: palette.table.rowDark.string },
      margins: { top: 60, bottom: 60, left: 50 },
      alignment: AlignmentType.CENTER,
      borders: borderStyleGlobal(palette.common.white.string),
    };

    rows.push(cells);
  });

  return rows;
};
