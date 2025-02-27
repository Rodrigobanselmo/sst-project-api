
import { RiskDataExamModel } from '@/@v2/documents/domain/models/risk-data-exam.model';
import { RiskDataModel } from '@/@v2/documents/domain/models/risk-data.model';
import { RiskModel } from '@/@v2/documents/domain/models/risk.model';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { checkValidExistentRisk } from '@/@v2/shared/domain/functions/security/check-valid-existent-risk.func';
import { sortNumber } from '@/@v2/shared/utils/sorts/number.sort';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { borderStyleGlobal } from '../../../base/config/styles';
import { RiskOrderEnum } from '../../../builders/pgr/enums/risk.enums';
import { palette } from '../../../constants/palette';
import { bodyTableProps } from './elements/body';
import { RiskCharacterizationColumnEnum } from './riskCharacterization.constant';

export const riskCharacterizationConverter = (
  risksdata: RiskDataModel[],
  getRiskDataExams: (riskData: RiskDataModel) => RiskDataExamModel[]
) => {
  const risksDataValid = risksdata.filter((riskData) => checkValidExistentRisk(riskData.risk));
  const riskMap: Record<string, { risk: RiskModel; exams: RiskDataExamModel[] }> = {};
  const body: bodyTableProps[][] = [];

  risksDataValid.forEach((riskData) => {
    if (riskMap[riskData.risk.id]) return riskMap[riskData.risk.id].exams.push(...getRiskDataExams(riskData))

    riskMap[riskData.risk.id] = {
      risk: riskData.risk,
      exams: getRiskDataExams(riskData),
    }
  });

  Object.values(riskMap).forEach((riskData) => {
    const cells: bodyTableProps[] = [];
    const risk = riskData.risk;

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
      text: riskData.exams.map((e) => e.exam.name).join('\n') || '--',
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
      text: risk.healthRisk || ' ',
      size: 4,
      borders: borderStyleGlobal(palette.common.white.string),
    };

    body.push(cells);
  });

  const bodyData = body
    .sort(([a], [b]) => sortString(a, b, 'text'))
    .sort(([a], [b]) => sortNumber(RiskOrderEnum[a.type as RiskTypeEnum], RiskOrderEnum[b.type as RiskTypeEnum]))
    .map((bodyRow, index) => bodyRow.map((cell) => ({ ...cell, darker: index % 2 != 0 })));

  return bodyData;
};
