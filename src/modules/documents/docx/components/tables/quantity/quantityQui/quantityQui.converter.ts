import { HomoTypeEnum } from '@prisma/client';

import { originRiskMap } from '../../../../../../../shared/constants/maps/origin-risk';
import { palette } from '../../../../../../../shared/constants/palette';
import { getMatrizRisk } from '../../../../../../../shared/utils/matriz';
import { sortData } from '../../../../../../../shared/utils/sorts/data.sort';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IRiskDataJson, IRiskDataJsonQui, QuantityTypeEnum } from '../../../../../../company/interfaces/risk-data-json.types';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityQuiColumnEnum } from './quantityQui.constant';

export const quantityQuiConverter = (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData.data
    .filter((row) => {
      if (!row.json || !row.isQuantity) return false;
      const json = row.json as unknown as IRiskDataJson;

      if (json.type !== QuantityTypeEnum.QUI) return false;
      return !!json.nr15ltProb || !!json.stelProb || !!json.twaProb;
    })
    .sort((a, b) => sortData(a.homogeneousGroup, b.homogeneousGroup, 'name'))
    .map((riskData) => {
      let origin: string;

      if (riskData.homogeneousGroup.environment)
        origin = `${riskData.homogeneousGroup.environment.name}\n(${originRiskMap[riskData.homogeneousGroup.environment.type].name})`;

      if (riskData.homogeneousGroup.characterization)
        origin = `${riskData.homogeneousGroup.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.characterization.type].name})`;

      if (!riskData.homogeneousGroup.type) origin = `${riskData.homogeneousGroup.name}\n(GSE)`;

      if (riskData.homogeneousGroup.type == HomoTypeEnum.HIERARCHY) {
        const hierarchy = hierarchyTree[riskData.homogeneousGroup.id];

        if (hierarchy) origin = `${hierarchy.name}\n(${originRiskMap[hierarchy.type].name})`;
      }

      const json = riskData.json as unknown as IRiskDataJsonQui;

      // const aren = json.aren;

      const array = [
        {
          result: json.nr15ltValue,
          leo: json.nr15lt,
          prob: json.nr15ltProb,
          type: json.isNr15Teto ? 'NR-15 LT TETO' : 'NR-15 LT',
        },
        {
          result: json.stelValue,
          leo: json.stel,
          prob: json.stelProb,
          type: json.isStelTeto ? 'ACGIH C' : 'ACGIH TLV-STEL',
        },
        {
          result: json.twaValue,
          leo: json.twa,
          prob: json.twaProb,
          type: json.isTwaTeto ? 'ACGIH C' : 'ACGIH TLV-TWA',
        },
        {
          result: json.vmpValue,
          leo: json.vmp,
          prob: json.vmpProb,
          type: json.isVmpTeto ? 'NR-15 LT TETO' : 'NR-15 VMP',
        },
      ];
      array.forEach((item) => {
        const cells: bodyTableProps[] = [];
        if (!item?.result || !item?.leo || !item.prob) return;

        const ro = getMatrizRisk(riskData.riskFactor.severity, item.prob);
        const ij = Number(item.result.replace(/[^0-9.]/g, '')) / Number(item.leo.replace(/[^0-9.]/g, ''));

        cells[QuantityQuiColumnEnum.ORIGIN] = {
          text: origin || '',
          shading: { fill: palette.table.header.string },
          borders: borderStyleGlobal(palette.common.white.string, {
            right: { size: 15 } as any,
          }),
        };
        cells[QuantityQuiColumnEnum.CHEMICAL] = {
          text: String(riskData.riskFactor.name) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.TYPE] = {
          text: String(item.type) || '-',
          shading: { fill: palette.table.row.string },
          borders: borderStyleGlobal(palette.common.white.string, {}),
        };
        cells[QuantityQuiColumnEnum.UNIT] = {
          text: String(riskData.riskFactor.unit || json.unit) || '-',
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

  return rows;
};
