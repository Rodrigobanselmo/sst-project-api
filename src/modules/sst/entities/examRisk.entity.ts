import { ExamToRisk, RiskFactors } from '@prisma/client';

import { ExamEntity } from './exam.entity';
import { RiskFactorsEntity } from './risk.entity';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';

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
  considerBetweenDays: number;
  fromAge: number;
  toAge: number;
  risk?: RiskFactorsEntity;
  exam?: ExamEntity;
  startDate: Date;
  endDate: Date;
  minRiskDegreeQuantity: number;
  minRiskDegree: number;
  isOld: boolean; // not used
  company?: CompanyEntity;

  constructor(partial: Partial<ExamRiskEntity>) {
    Object.assign(this, partial);
  }
}
