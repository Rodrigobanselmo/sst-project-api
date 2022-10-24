import { EngsToRiskFactorData } from '@prisma/client';
import { RecMedEntity } from './recMed.entity';
import { RiskFactorDataEntity } from './riskData.entity';

export class EngsRiskDataEntity implements EngsToRiskFactorData {
  recMedId: string;
  riskFactorDataId: string;
  efficientlyCheck: boolean;
  recMed?: RecMedEntity;
  riskData?: RiskFactorDataEntity;
  startDate: Date;
  endDate: Date;

  constructor(partial: Partial<EngsRiskDataEntity>) {
    Object.assign(this, partial);
  }
}
