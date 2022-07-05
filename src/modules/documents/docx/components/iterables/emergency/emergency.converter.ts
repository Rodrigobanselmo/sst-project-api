import { RiskFactorDataEntity } from '../../../../../checklist/entities/riskData.entity';

export const emergencyConverter = (
  riskData: Partial<RiskFactorDataEntity>[],
): string[] => {
  const risks = [];

  riskData.forEach((data) => {
    if (data?.riskFactor && data.riskFactor.isEmergency)
      risks.push(data?.riskFactor.name);
  });

  return risks;
};
