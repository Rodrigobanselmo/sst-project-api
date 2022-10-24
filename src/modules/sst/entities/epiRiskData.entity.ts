import { EpiToRiskFactorData } from '@prisma/client';
import { EpiEntity } from './epi.entity';
import { RiskFactorDataEntity } from './riskData.entity';

export class EpiRiskDataEntity implements EpiToRiskFactorData {
  epiId: number;
  riskFactorDataId: string;
  lifeTimeInDays: number;
  efficientlyCheck: boolean;
  epcCheck: boolean;
  longPeriodsCheck: boolean;
  validationCheck: boolean;
  tradeSignCheck: boolean;
  sanitationCheck: boolean;
  maintenanceCheck: boolean;
  unstoppedCheck: boolean;
  trainingCheck: boolean;
  epi?: EpiEntity;
  riskData?: RiskFactorDataEntity;
  startDate: Date;
  endDate: Date;
  constructor(partial: Partial<EpiRiskDataEntity>) {
    Object.assign(this, partial);
  }
}
