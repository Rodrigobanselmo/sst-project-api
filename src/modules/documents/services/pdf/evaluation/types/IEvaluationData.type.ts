import { RiskFactorDataEntity } from '../../../../../sst/entities/riskData.entity';
import { HierarchyEntity } from '../../../../../company/entities/hierarchy.entity';
import { EmployeeExamsHistoryEntity } from '../../../../../company/entities/employee-exam-history.entity';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { SexTypeEnum } from '@prisma/client';

import { EmployeeEntity } from '../../../../../company/entities/employee.entity';
import { RiskFactorsEntity } from '../../../../../sst/entities/risk.entity';

export interface IEvaluationQuestion {
  name: string;
  textAnswer?: string;
  objectiveAnswer?: string[];
  sex?: SexTypeEnum;
}

export interface IPdfEvaluationData {
  questions: IEvaluationQuestion[];
  examination: IEvaluationQuestion[];
  employee?: EmployeeEntity;
  admissionDate: Date;
  consultantCompany: CompanyEntity;
  actualCompany: CompanyEntity;
  doctorResponsible: Partial<ProfessionalEntity>;
  clinicExam: EmployeeExamsHistoryEntity;
  sector: HierarchyEntity;
  risks: {
    riskData: RiskFactorDataEntity;
    riskFactor: RiskFactorsEntity;
  }[];
}
