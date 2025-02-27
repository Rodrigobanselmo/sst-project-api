import sortArray from 'sort-array';

import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { matrixRiskMap } from '../../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../../constants/origin-risk';
import { palette } from '../../../../constants/palette';
import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityQuiColumnEnum } from './quantityQui.constant';

export const quantityQuiConverter = ({ riskGroupData }: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData
    .filter(({ riskData }) => {
      if (!riskData.isQuantity) return false;
      if (!riskData.quantityQui) return false;
      return !!riskData.quantityQui.nr15ltProb || !!riskData.quantityQui.stelProb || !!riskData.quantityQui.twaProb;
    })
    .map((riskData) => {

      let origin: string = '';
      if (riskData.homogeneousGroup.gho.isEnviroment && riskData.homogeneousGroup.gho.characterization)
        origin = `${riskData.homogeneousGroup.gho.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.gho.characterization.type].name})`;

      if (riskData.homogeneousGroup.gho.isCharacterization && riskData.homogeneousGroup.gho.characterization)
        origin = `${riskData.homogeneousGroup.gho.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.gho.characterization.type].name})`;

      if (!riskData.homogeneousGroup.gho.type) origin = `${riskData.homogeneousGroup.gho.name}\n(GSE)`;

      if (riskData.homogeneousGroup.gho.isHierarchy) {
        const hierarchy = hierarchyTree[riskData.homogeneousGroup.gho.id];

        if (hierarchy) origin = `${hierarchy.name}\n(${originRiskMap[hierarchy.type].name})`;
      }

      const json = riskData.riskData.quantityQui

      const array = [
        {
          result: json?.nr15ltValue,
          leo: json?.nr15lt,
          prob: json?.nr15ltProb,
          type: json?.isNr15Teto ? 'NR-15 LT TETO' : 'NR-15 LT',
        },
        {
          result: json?.stelValue,
          leo: json?.stel,
          prob: json?.stelProb,
          type: json?.isStelTeto ? 'ACGIH C' : 'ACGIH TLV-STEL',
        },
        {
          result: json?.twaValue,
          leo: json?.twa,
          prob: json?.twaProb,
          type: json?.isTwaTeto ? 'ACGIH C' : 'ACGIH TLV-TWA',
        },
        {
          result: json?.vmpValue,
          leo: json?.vmp,
          prob: json?.vmpProb,
          type: json?.isVmpTeto ? 'NR-15 LT TETO' : 'NR-15 VMP',
        },
      ];

      array.forEach((item) => {
        const cells: bodyTableProps[] = [];
        if (!item?.result || !item?.leo || !item.prob) return;

        const ro = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, item.prob)];
        const ij = Number(item.result.replace(/[^0-9.]/g, '')) / Number(item.leo.replace(/[^0-9.]/g, ''));

        cells[QuantityQuiColumnEnum.ORIGIN] = {
          text: origin || '',
          shading: { fill: palette.table.header.string },
          borders: borderStyleGlobal(palette.common.white.string, {
            right: { size: 15 } as any,
          }),
        };
        cells[QuantityQuiColumnEnum.CHEMICAL] = {
          text: String(riskData.riskData.risk.name) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.TYPE] = {
          text: String(item.type) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.UNIT] = {
          text: String(riskData.riskData.risk.unit || json?.unit) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.RESULT] = {
          text: String(item.result) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.LEO] = {
          text: String(item.leo) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.IJ] = {
          text: String(ij.toFixed(5)) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.RO] = {
          text: ro.table || '-',
          shading: { fill: palette.table.rowDark.string },
          borders: borderStyleGlobal(palette.common.white.string, {
            left: { size: 15 } as any,
          }),
        };

        rows.push(cells);
      });
    });

  return sortArray(rows, {
    by: ['name', ''],
    computed: {
      name: (v) => {
        return v[QuantityQuiColumnEnum.ORIGIN]?.text || '';
      },
      agent: (v) => {
        return v[QuantityQuiColumnEnum.CHEMICAL]?.text || '';
      },
    },
  });
};
