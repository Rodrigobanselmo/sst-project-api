import { ExamToRiskData } from '@prisma/client';
import { ExamEntity } from './exam.entity';
import { RiskFactorDataEntity } from './riskData.entity';

export class ExamRiskDataEntity implements ExamToRiskData {
  examId: number;
  riskFactorDataId: string;
  isMale: boolean;
  isFemale: boolean;
  isPeriodic: boolean;
  isChange: boolean;
  isAdmission: boolean;
  isReturn: boolean;
  isDismissal: boolean;
  validityInMonths: number;
  lowValidityInMonths: number;
  considerBetweenDays: number;
  fromAge: number;
  toAge: number;
  riskData?: RiskFactorDataEntity;
  exam?: ExamEntity;

  isStandard?: boolean;

  constructor(partial: Partial<ExamRiskDataEntity>) {
    Object.assign(this, partial);

    if (this?.riskData) this.riskData = new RiskFactorDataEntity(this.riskData);
  }
}
