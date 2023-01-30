import { RiskFactorsEnum } from '@prisma/client';
import { QuantityTypeEnum } from '../../modules/company/interfaces/risk-data-json.types';
import { RiskFactorsEntity } from '../../modules/sst/entities/risk.entity';

export const isRiskQuantity = (risk?: RiskFactorsEntity) => {
  if (!risk) return;

  const code = risk?.esocialCode;

  if (risk.type === RiskFactorsEnum.QUI) return QuantityTypeEnum.QUI;

  if (code == '02.01.002') return QuantityTypeEnum.VL;

  if (code == '02.01.001') return QuantityTypeEnum.NOISE;

  if (code == '02.01.014') return QuantityTypeEnum.HEAT;

  if (code == '02.01.004' || code == '02.01.003') return QuantityTypeEnum.VFB;

  if (code == '02.01.006') return QuantityTypeEnum.RADIATION;

  return null;
};
