import { AlignmentType, TextDirection, VerticalAlign } from 'docx';
import { palette } from '../../../../../constants/palette';
import { borderStyleGlobal } from '../../../../../base/config/styles';
import { bodyTableProps } from '../../elements/body';
import { matrixRisk } from '@/@v2/shared/domain/constants/security/matriz-risk.constant';
import { matrixRiskMap } from '../../../../../constants/matriz-risk-map';

export const NewTableData = (): bodyTableProps[][] => {
  const legend = {
    text: `**GRAU DE EXPOSIÇÃO**\n**PROBABILIDADE**`,
    size: 5,
    borders: borderStyleGlobal(palette.common.white.string, {
      size: 2,
    }),
    shading: { fill: palette.common.white.string },
    alignment: AlignmentType.CENTER,
    verticalAlign: VerticalAlign.CENTER,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
    rowSpan: matrixRisk[0].length + 1,
    textSize: 7,
    color: palette.common.black.string,
  };

  const tableRows: bodyTableProps[][] = matrixRisk.map((row, probability) => {
    const rowCell = [
      {
        text: `**${String(5 - probability)}**`,
        size: 5,
        borders: borderStyleGlobal(palette.common.white.string, {
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
          size: 18,
          borders: borderStyleGlobal(palette.common.white.string, {
            size: 10,
          }),
          shading: { fill: matrix.color },
          alignment: AlignmentType.CENTER,
          textSize: 7,
          color: palette.common.black.string,
        };
      }),
    ];

    if (probability === 0) rowCell.unshift(legend);

    return rowCell;
  });

  const severityRow: bodyTableProps[] = Array.from({
    length: matrixRisk.length + 1,
  }).map((_, severity) => {
    return {
      text: `**${severity ? String(severity) : ''}**`,
      size: severity ? 18 : 5,
      borders: borderStyleGlobal(palette.common.white.string, {
        size: 10,
      }),
      shading: { fill: palette.common.black.string },
      alignment: AlignmentType.CENTER,
      textSize: 7,
      color: palette.common.white.string,
    };
  });

  const lastRow: bodyTableProps[] = [
    {
      text: ``,
      size: 5,
      borders: borderStyleGlobal(palette.common.white.string, {
        size: 2,
      }),
      shading: { fill: palette.common.white.string },
      columnSpan: 2,
      textSize: 7,
    },
    {
      text: `GRAU DE EFEITO À SAÚDE (SEVERIDADE)`,
      size: 5,
      borders: borderStyleGlobal(palette.common.white.string, {
        size: 2,
      }),
      shading: { fill: palette.common.white.string },
      alignment: AlignmentType.CENTER,
      columnSpan: matrixRisk.length,
      textSize: 7,
      color: palette.common.black.string,
    },
  ];

  tableRows.push(severityRow, lastRow);

  return tableRows;
};
