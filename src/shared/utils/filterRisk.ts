import { RiskFactorsEntity } from "../../modules/sst/entities/risk.entity";
import { RiskFactorDataEntity } from "../../modules/sst/entities/riskData.entity";

export function filterRisk(risk: RiskFactorsEntity | Partial<RiskFactorDataEntity>) {
  const riskFactor = 'riskFactor' in risk ? risk.riskFactor : risk as RiskFactorsEntity;

  if (riskFactor?.representAll) {
    return false;
  }

  return true;
}
