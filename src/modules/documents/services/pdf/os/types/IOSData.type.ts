import { RecMedEntity } from './../../../../../sst/entities/recMed.entity';
import { EpiRiskDataEntity } from './../../../../../sst/entities/epiRiskData.entity';
import { ProtocolToRiskEntity } from '../../../../../sst/entities/protocol.entity';
import { HierarchyEntity } from '../../../../../company/entities/hierarchy.entity';
import { RiskFactorsEntity } from '../../../../../sst/entities/risk.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { EmployeeEntity } from '../../../../../company/entities/employee.entity';
import { ExamEntity } from '../../../../../sst/entities/exam.entity';
import { EmployeeExamsHistoryEntity } from '../../../../../company/entities/employee-exam-history.entity';
import { RiskFactorDataEntity } from '../../../../../sst/entities/riskData.entity';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';
import { EngsRiskDataEntity } from '../../../../../sst/entities/engsRiskData.entity';
import { CompanyOSEntity } from '../../../../../../modules/company/entities/os.entity';

export interface IPdfOSData {
  os: CompanyOSEntity;
  employee: EmployeeEntity;
  consultantCompany: CompanyEntity;
  actualCompany: CompanyEntity;
  epis: EpiRiskDataEntity[];
  epcs: EngsRiskDataEntity[];
  adms: RecMedEntity[];
  sector: HierarchyEntity;
  risks: {
    riskData: RiskFactorDataEntity;
    riskFactor: RiskFactorsEntity;
  }[];
}
