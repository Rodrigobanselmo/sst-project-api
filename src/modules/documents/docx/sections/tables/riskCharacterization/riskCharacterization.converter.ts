/* eslint-disable prettier/prettier */
import { RiskOrderEnum } from '../../../../../../shared/constants/enum/risk.enums';
import { palette } from '../../../../../../shared/constants/palette';
import { sortNumber } from '../../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';

import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { bodyTableProps } from './elements/body';
import { RiskCharacterizationColumnEnum } from './riskCharacterization.constant';

export const riskCharacterizationConverter = (riskGroup: RiskFactorGroupDataEntity) => {
  const riskMap: Record<string, bodyTableProps[]> = {}

  riskGroup.data.forEach((riskData) => {
    const cells: bodyTableProps[] = [];

    if (riskMap[riskData.riskId]) return
    const risk = riskData.riskFactor

    cells[RiskCharacterizationColumnEnum.AGENT] = { text: risk.name || 'NA', size: 4, type: risk.type, shading: { fill: palette.table.header.string } }
    cells[RiskCharacterizationColumnEnum.CAS] = { text: risk.cas || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.PROPAGATION] = { text: (risk.propagation||[]).join('\n') || 'NA' , size: 2 }
    cells[RiskCharacterizationColumnEnum.UNIT] = { text: risk.unit || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.NR15LT] = { text: risk.nr15lt || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.ACGIH_TWA] = { text: risk.twa || 'NA', size: 3 }
    cells[RiskCharacterizationColumnEnum.ACGIH_STEL] = { text: risk.stel || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.IPVS] = { text: risk.ipvs || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.PV] = { text: risk.pv || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.PE] = { text: risk.pe || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.CARNOGENICITY_ACGIH] = { text: risk.carnogenicityACGIH || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.CARNOGENICITY_LINACH] = { text: risk.carnogenicityLinach || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.BEI] = { text: risk.exame || 'NA', size: 2 }
    cells[RiskCharacterizationColumnEnum.SEVERITY] = { text: String(risk.severity || '-'), size: 1, shading: { fill: palette.table.header.string } }
    cells[RiskCharacterizationColumnEnum.SYMPTOMS] = { text: risk.symptoms || ' ', size: 4  }
    cells[RiskCharacterizationColumnEnum.EFFECT_BODY] = { text: risk.risk || ' ', size: 4  }

    riskMap[riskData.riskId] = cells
  });

  const bodyData = Object.values(riskMap)
    .sort(([a], [b]) => sortString(a, b, 'text'))
    .sort(([a], [b]) =>
      sortNumber(RiskOrderEnum[a.type], RiskOrderEnum[b.type]),
    ).map((bodyRow,index) => bodyRow.map((cell) => ({...cell, darker: index % 2 != 0})));
    
  return bodyData;
};
