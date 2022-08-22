import { ExamToRisk, RiskFactors } from '@prisma/client';

import { ExamEntity } from './exam.entity';

export class ExamRiskEntity implements ExamToRisk {
  id: number;
  examId: number;
  riskId: string;
  companyId: string;
  isMale: boolean;
  isFemale: boolean;
  isPeriodic: boolean;
  isChange: boolean;
  isAdmission: boolean;
  isReturn: boolean;
  isDismissal: boolean;
  validityInMonths: number;
  lowValidityInMonths: number;
  fromAge: number;
  toAge: number;
  risk?: RiskFactors;
  exam?: ExamEntity;
  startDate: Date;
  endDate: Date;
  minRiskDegreeQuantity: number;
  minRiskDegree: number;
  isOld: boolean; // not used

  constructor(partial: Partial<ExamRiskEntity>) {
    Object.assign(this, partial);
  }
}
