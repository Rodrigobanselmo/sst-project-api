import { AlignmentType } from 'docx';
import { palette } from '../../../../../../../shared/constants/palette';
import { borderStyle } from '../../../../base/config/styles';
import { bodyTableProps } from '../elements/body';
import {
  matrixRisk,
  matrixRiskMap,
} from './../../../../../constants/matrizRisk.constant';

export const NewTableData = (): bodyTableProps[][] => {
  const tableRows: bodyTableProps[][] = matrixRisk.map((row, probability) => {
    return [
      {
        text: `**${String(5 - probability)}**`,
        size: 5,
        borders: borderStyle(palette.common.white.string, {
          size: 2,
        }),
        shading: { fill: palette.common.black.string },
        alignment: AlignmentType.CENTER,
        textSize: 7,
        color: palette.common.white.string,
      },
      ...row.map((cell) => {
        const matrix = matrixRiskMap[cell as keyof typeof matrixRiskMap];

        return {
          text: matrix.table
            .split('\n')
            .map((text) => `**${text}**`)
            .join('\n'),
          size: 19,
          borders: borderStyle(palette.common.white.string, {
            size: 10,
          }),
          shading: { fill: matrix.color },
          alignment: AlignmentType.CENTER,
          textSize: 7,
          color: palette.common.black.string,
        };
      }),
    ];
  });

  const lastRow: bodyTableProps[] = Array.from({
    length: matrixRisk.length + 1,
  }).map((_, severity) => {
    return {
      text: `**${severity ? String(severity) : ''}**`,
      size: severity ? 19 : 5,
      borders: borderStyle(palette.common.white.string, {
        size: 10,
      }),
      shading: { fill: palette.common.black.string },
      alignment: AlignmentType.CENTER,
      textSize: 7,
      color: palette.common.white.string,
    };
  });

  tableRows.push(lastRow);

  return tableRows;
};
