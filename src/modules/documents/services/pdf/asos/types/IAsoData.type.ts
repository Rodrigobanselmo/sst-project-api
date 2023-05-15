import { ProtocolToRiskEntity } from './../../../../../sst/entities/protocol.entity';
import { HierarchyEntity } from './../../../../../company/entities/hierarchy.entity';
import { RiskFactorsEntity } from '../../../../../../modules/sst/entities/risk.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { EmployeeEntity } from '../../../../../company/entities/employee.entity';
import { ExamEntity } from '../../../../../sst/entities/exam.entity';
import { EmployeeExamsHistoryEntity } from './../../../../../company/entities/employee-exam-history.entity';
import { RiskFactorDataEntity } from './../../../../../sst/entities/riskData.entity';
import { ProfessionalEntity } from './../../../../../users/entities/professional.entity';

export interface IPdfAsoData {
  doneExams: {
    exam: ExamEntity;
    doneDate: Date;
  }[];
  admissionDate: Date;
  employee: EmployeeEntity;
  consultantCompany: CompanyEntity;
  actualCompany: CompanyEntity;
  doctorResponsible: Partial<ProfessionalEntity>;
  clinicExam: EmployeeExamsHistoryEntity;
  sector: HierarchyEntity;
  risks: {
    riskData: RiskFactorDataEntity;
    riskFactor: RiskFactorsEntity;
  }[];
  numAsos: number;
  protocols: ProtocolToRiskEntity[];
}
