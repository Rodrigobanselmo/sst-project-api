import sortArray from 'sort-array';

import { RiskFactorsEntity } from './../../modules/sst/entities/risk.entity';
import { RiskFactorDataEntity } from './../../modules/sst/entities/riskData.entity';

export type IPriorRiskData = { riskData: RiskFactorDataEntity[]; riskFactor: RiskFactorsEntity };

export function onGetRisks(riskData: RiskFactorDataEntity[]) {
  const risks: Record<string, { riskData: RiskFactorDataEntity[]; riskFactor: RiskFactorsEntity }> = {};

  riskData.forEach(({ riskFactor, ..._rd }) => {
    if (riskFactor?.representAll) return;

    if (!risks[_rd.riskId])
      risks[_rd.riskId] = {
        riskData: [],
        riskFactor: riskFactor,
      };

    risks[_rd.riskId].riskData.push(_rd as any);
  });

  return Object.values(risks).map((data) => {
    data.riskData =
      sortArray(data.riskData, {
        by: ['prioritization', 'level', 'isQuantity'],
        order: ['prioritization', 'level', 'isQuantity'],
      }) || [];

    return {
      riskFactor: data.riskFactor,
      riskData: data.riskData,
    };
  });
}
