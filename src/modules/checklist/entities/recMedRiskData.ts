import { RecMedToRiskFactorData } from '@prisma/client';
import { RecMedEntity } from './recMed.entity';
import { RiskFactorDataEntity } from './riskData.entity';

export class RecMedRiskDataEntity implements RecMedToRiskFactorData {
  recMedId: string;
  riskFactorDataId: string;
  efficientlyCheck: boolean;
  recMed?: RecMedEntity;
  riskData?: RiskFactorDataEntity;

  constructor(partial: Partial<RecMedRiskDataEntity>) {
    Object.assign(this, partial);
  }
}
