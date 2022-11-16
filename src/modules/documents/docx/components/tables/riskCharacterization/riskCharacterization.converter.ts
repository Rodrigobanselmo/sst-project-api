import { RiskOrderEnum } from '../../../../../../shared/constants/enum/risk.enums';
import { palette } from '../../../../../../shared/constants/palette';
import { sortNumber } from '../../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';

import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { borderStyleGlobal } from '../../../base/config/styles';
import { bodyTableProps } from './elements/body';
import { RiskCharacterizationColumnEnum } from './riskCharacterization.constant';

export const riskCharacterizationConverter = (riskGroup: RiskFactorGroupDataEntity) => {
  const riskMap: Record<string, bodyTableProps[]> = {};

  riskGroup.data.forEach((riskData) => {
    const cells: bodyTableProps[] = [];

    if (riskMap[riskData.riskId]) return;
    const risk = riskData.riskFactor;

    cells[RiskCharacterizationColumnEnum.AGENT] = {
      text: risk.name || '--',
      size: 4,
      type: risk.type,
      shading: { fill: palette.table.header.string },
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.CAS] = {
      text: risk.cas || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.PROPAGATION] = {
      text: (risk.propagation || []).join('\n') || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.UNIT] = {
      text: risk.unit || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.NR15LT] = {
      text: risk.nr15lt || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.ACGIH_TWA] = {
      text: risk.twa || '--',
      size: 3,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.ACGIH_STEL] = {
      text: risk.stel || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.IPVS] = {
      text: risk.ipvs || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.PV] = {
      text: risk.pv || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.PE] = {
      text: risk.pe || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.CARNOGENICITY_ACGIH] = {
      text: risk.carnogenicityACGIH || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.CARNOGENICITY_LINACH] = {
      text: risk.carnogenicityLinach || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.BEI] = {
      text: risk.exame || '--',
      size: 2,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.SEVERITY] = {
      text: String(risk.severity || '-'),
      size: 1,
      shading: {
        fill: palette.table.header.string,
      },
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.SYMPTOMS] = {
      text: risk.symptoms || ' ',
      size: 4,
      borders: borderStyleGlobal(palette.common.white.string),
    };
    cells[RiskCharacterizationColumnEnum.EFFECT_BODY] = {
      text: risk.risk || ' ',
      size: 4,
      borders: borderStyleGlobal(palette.common.white.string),
    };

    riskMap[riskData.riskId] = cells;
  });

  const bodyData = Object.values(riskMap)
    .sort(([a], [b]) => sortString(a, b, 'text'))
    .sort(([a], [b]) => sortNumber(RiskOrderEnum[a.type], RiskOrderEnum[b.type]))
    .map((bodyRow, index) => bodyRow.map((cell) => ({ ...cell, darker: index % 2 != 0 })));

  return bodyData;
};
