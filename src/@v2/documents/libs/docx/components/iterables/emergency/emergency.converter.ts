import { IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';

export const emergencyConverter = (riskData: IRiskGroupDataConverter[]): string[] => {
  const risks = [] as string[];

  riskData.forEach((data) => {
    if (data?.riskData && data.riskData.risk.isEmergency) risks.push(data.riskData.risk.name);
  });

  return risks;
};
