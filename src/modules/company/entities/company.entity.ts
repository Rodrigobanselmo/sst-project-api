import { ProfessionalCouncil, StatusEnum } from '@prisma/client';
import { DocumentDataEntity } from './../../sst/entities/documentData.entity';
import { ExamEntity } from './../../sst/entities/exam.entity';
import { ProtocolEntity } from './../../sst/entities/protocol.entity';
import { RecMedEntity } from './../../sst/entities/recMed.entity';
import { RiskDocumentEntity } from './../../sst/entities/riskDocument.entity';

import { Company, CompanyPaymentTypeEnum, CompanyTypesEnum } from '.prisma/client';
import { DocumentModelEntity } from '../../../modules/documents/entities/document-model.entity';
import { CompanyCertEntity } from '../../../modules/esocial/entities/companyCert.entity';
import { EmployeeESocialBatchEntity } from '../../../modules/esocial/entities/employeeEsocialBatch.entity';
import { RiskFactorDataEntity } from '../../../modules/sst/entities/riskData.entity';
import { UserCompanyEntity } from '../../../modules/users/entities/userCompany.entity';
import { CompanyStepEnum } from '../../../shared/constants/enum/stepCompany.enum';
import { ExamToClinicEntity } from '../../sst/entities/examToClinic';
import { RiskFactorGroupDataEntity } from '../../sst/entities/riskGroupData.entity';
import { EmployeeESocialEventEntity } from './../../esocial/entities/employeeEsocialEvent.entity';
import { RiskFactorsEntity } from './../../sst/entities/risk.entity';
import { ProfessionalResponsibleEntity } from './../../users/entities/professional-responsible.entity';
import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { ActivityEntity } from './activity.entity';
import { AddressCompanyEntity } from './address-company.entity';
import { AlertEntity } from './alert.entity';
import { CharacterizationEntity } from './characterization.entity';
import { CompanyClinicsEntity } from './company-clinics.entity';
import { CompanyGroupEntity } from './company-group.entity';
import { ContactEntity } from './contact.entity';
import { ContractEntity } from './contract.entity';
import { DocumentCoverEntity } from './document-cover.entity';
import { DocumentEntity } from './document.entity';
import { EmployeeExamsHistoryEntity } from './employee-exam-history.entity';
import { EmployeeEntity } from './employee.entity';
import { HierarchyEntity } from './hierarchy.entity';
import { HomoGroupEntity } from './homoGroup.entity';
import { LicenseEntity } from './license.entity';
import { CompanyOSEntity } from './os.entity';
import { CompanyReportEntity } from './report.entity';
import { ScheduleBlockEntity } from './schedule-block.entity';
import { WorkspaceEntity } from './workspace.entity';

export class CompanyEntity implements Company {
  id: string;
  cnpj: string;
  name: string;
  fantasy: string;
  status: StatusEnum;
  type: CompanyTypesEnum;
  isConsulting: boolean;
  created_at: Date;
  updated_at: Date;
  licenseId: number;
  groupId: number;
  parentCompanyId: string;
  license?: LicenseEntity;
  address?: AddressCompanyEntity;
  workspace?: WorkspaceEntity[];
  employees?: EmployeeEntity[];
  deleted_at: Date | null;

  primary_activity?: ActivityEntity[];
  secondary_activity?: ActivityEntity[];
  environments?: CharacterizationEntity[];
  characterization?: CharacterizationEntity[];
  professionals?: ProfessionalEntity[];
  riskFactorGroupData?: RiskFactorGroupDataEntity[];
  email: string;
  logoUrl: string;
  responsibleName: string;
  phone: string;
  operationTime: string;

  activityStartDate: Date;
  activity_start_date: string;

  receivingServiceContracts?: ContractEntity[];
  applyingServiceContracts?: ContractEntity[];
  responsibleNit: string;
  responsibleCpf: string;
  initials: string;
  description: string;
  unit: string;
  numAsos: number;
  blockResignationExam: boolean;
  doctorResponsibleId: number;
  tecResponsibleId: number;
  contacts?: ContactEntity[];
  covers?: DocumentCoverEntity[];
  isClinic: boolean;

  employeeCount?: number;
  riskGroupCount?: number;
  homogenousGroupCount?: number;
  hierarchyCount?: number;
  professionalCount?: number;
  examClinicCount?: number;
  usersCount?: number;
  riskCount?: number;
  examsCount?: number;
  characterizationCount?: number;
  lastDocumentVersion?: RiskDocumentEntity[];
  employeeAwayCount?: number;
  employeeInactiveCount?: number;
  clinicsConnectedCount?: number;
  protocolsCount?: number;
  episCount?: number;

  step?: CompanyStepEnum;
  steps?: CompanyStepEnum[];
  paymentType: CompanyPaymentTypeEnum;
  paymentDay: number;
  isTaxNote: boolean;
  observationBank: string;
  companiesToClinicAvailable: CompanyClinicsEntity[];
  clinicsAvailable?: CompanyClinicsEntity;
  clinicExams?: ExamToClinicEntity[];
  report: CompanyReportEntity;
  riskDegree?: number;
  isGroup: boolean;
  esocialSend: boolean;
  companyGroupId: number;
  esocialStart: Date;
  esocialLastTransmission: Date;
  group?: Partial<CompanyGroupEntity>;
  cert?: CompanyCertEntity;
  riskFactors?: RiskFactorsEntity[];
  hierarchy?: HierarchyEntity[];
  recMed?: RecMedEntity[];
  exams?: ExamEntity[];
  homogeneousGroup?: HomoGroupEntity[];
  os?: CompanyOSEntity;

  esocialEvents?: EmployeeESocialEventEntity[];
  esocialTransmissions?: EmployeeESocialBatchEntity[];

  doctorResponsible?: Partial<ProfessionalEntity>;
  tecResponsible?: Partial<ProfessionalEntity>;
  professionalsResponsibles?: Partial<ProfessionalResponsibleEntity>[];
  ambResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;

  scheduleBlocks?: ScheduleBlockEntity[];
  alerts?: AlertEntity[];
  documentData?: DocumentDataEntity[];
  documentModels?: DocumentModelEntity[];
  users?: UserCompanyEntity[];
  riskFactorDocument?: RiskDocumentEntity[];
  riskFactorData?: RiskFactorDataEntity[];
  protocol?: ProtocolEntity[];
  examClinicHistory?: EmployeeExamsHistoryEntity[];
  documents?: DocumentEntity[];

  permissions: string[];

  //! remove >>>
  mission: string;
  vision: string;
  values: string;

  cadastral_situation_date: string;
  legal_nature_code: string;
  size: string;
  legal_nature: string;
  cadastral_situation: string;
  cadastral_situation_description: string;

  coordinatorName: string; // remover
  stateRegistration: string;
  shortName: string;
  obs: string;
  //! remove ^^^

  constructor(partial: Partial<CompanyEntity>) {
    Object.assign(this, partial);

    if (this.professionalsResponsibles) {
      this.professionalsResponsibles = this.professionalsResponsibles.map((p) => new ProfessionalResponsibleEntity(p));
      const professional = this.professionalsResponsibles.find((p) => p.type === 'AMB')?.professional;
      this.ambResponsible = professional;
    }

    if (this.primary_activity && this.primary_activity[0]) {
      this.riskDegree = this.primary_activity[0].riskDegree;
    }

    if (this.riskFactors) {
      this.riskFactors = this.riskFactors.map((risk) => new RiskFactorsEntity(risk));
    }

    if (this.documentData) {
      this.documentData = this.documentData.map((data) => new DocumentDataEntity(data));
    }

    if (this.scheduleBlocks) {
      this.scheduleBlocks = this.scheduleBlocks.map((s) => new ScheduleBlockEntity(s));
    }

    if (this.employees) {
      this.employees = this.employees.map((e) => new EmployeeEntity(e as any));
    }

    if (this.group) {
      this.group = new CompanyGroupEntity(this.group);

      if (!this.doctorResponsible) this.doctorResponsible = this.group?.doctorResponsible;
      if (!this.doctorResponsibleId) this.doctorResponsibleId = this.group?.doctorResponsibleId;

      if (!this.tecResponsible) this.tecResponsible = this.group?.tecResponsible;
      if (!this.tecResponsibleId) this.tecResponsibleId = this.group?.tecResponsibleId;

      if (!this.ambResponsible) this.ambResponsible = this.group?.ambResponsible;
      if (!this.cert) this.cert = this.group?.cert;
      if (!this.os) this.os = this.group?.os;
      if (!this.esocialStart) this.esocialStart = this.group?.esocialStart;
      if (!this.numAsos) this.numAsos = this.group?.numAsos;
      if (!this.blockResignationExam) this.blockResignationExam = this.group?.blockResignationExam;
      if (!this.blockResignationExam) this.blockResignationExam = this.group?.blockResignationExam;
    }

    if (this.doctorResponsible) {
      this.doctorResponsible = new ProfessionalEntity(this.doctorResponsible);
    }

    if (this.tecResponsible) {
      this.tecResponsible = new ProfessionalEntity(this.tecResponsible);
    }

    if (this.isClinic) {
      this.getClinicStep();
    } else {
      this.getCompanyStep();
    }
  }

  private getCompanyStep() {
    this.steps = [
      CompanyStepEnum.WORKSPACE,
      CompanyStepEnum.EMPLOYEE,
      CompanyStepEnum.HIERARCHY,
      CompanyStepEnum.HOMO_GROUP,
      CompanyStepEnum.RISK_GROUP,
      CompanyStepEnum.RISKS,
      CompanyStepEnum.NONE,
    ];

    const workspaceStep = this.workspace && this.workspace.length == 0;
    const employeeStep = this.employeeCount == 0;
    const hierarchyStep = this.hierarchyCount == 0;
    const homoStep = this.homogenousGroupCount == 0;
    const riskGroupStep = this.riskGroupCount == 0;

    if (workspaceStep) {
      return (this.step = CompanyStepEnum.WORKSPACE);
    }

    if (employeeStep && hierarchyStep) {
      return (this.step = CompanyStepEnum.EMPLOYEE);
    }

    if (hierarchyStep) {
      return (this.step = CompanyStepEnum.HIERARCHY);
    }

    if (homoStep && riskGroupStep) {
      return (this.step = CompanyStepEnum.HOMO_GROUP);
    }

    if (riskGroupStep) {
      return (this.step = CompanyStepEnum.RISK_GROUP);
    }

    return (this.step = CompanyStepEnum.RISKS);
  }

  private getClinicStep() {
    this.steps = [CompanyStepEnum.EXAMS, CompanyStepEnum.PROFESSIONALS, CompanyStepEnum.USERS, CompanyStepEnum.NONE];

    const professionalStep = this.professionalCount == 0;
    const examStep = this.examClinicCount == 0;
    const usersStep = this.usersCount == 0;

    if (examStep) {
      return (this.step = CompanyStepEnum.EXAMS);
    }

    if (professionalStep) {
      return (this.step = CompanyStepEnum.PROFESSIONALS);
    }

    if (usersStep) {
      return (this.step = CompanyStepEnum.USERS);
    }

    return (this.step = CompanyStepEnum.NONE);
  }
}
