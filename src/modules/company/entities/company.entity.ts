import { ApiProperty } from '@nestjs/swagger';
import { ProfessionalCouncil, StatusEnum } from '@prisma/client';

import { CompanyCertEntity } from '../../../modules/esocial/entities/companyCert.entity';
import { EmployeeESocialBatchEntity } from '../../../modules/esocial/entities/employeeEsocialBatch.entity';
import { CompanyStepEnum } from '../../../shared/constants/enum/stepCompany.enum';
import { ExamToClinicEntity } from '../../sst/entities/examToClinic';
import { RiskFactorGroupDataEntity } from '../../sst/entities/riskGroupData.entity';
import { EmployeeESocialEventEntity } from './../../esocial/entities/employeeEsocialEvent.entity';
import { RiskFactorsEntity } from './../../sst/entities/risk.entity';
import { ProfessionalResponsibleEntity } from './../../users/entities/professional-responsible.entity';
import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { ActivityEntity } from './activity.entity';
import { AddressCompanyEntity } from './address-company.entity';
import { CharacterizationEntity } from './characterization.entity';
import { CompanyClinicsEntity } from './company-clinics.entity';
import { CompanyGroupEntity } from './company-group.entity';
import { ContactEntity } from './contact.entity';
import { ContractEntity } from './contract.entity';
import { DocumentCoverEntity } from './document-cover.entity';
import { EmployeeEntity } from './employee.entity';
import { EnvironmentEntity } from './environment.entity';
import { HierarchyEntity } from './hierarchy.entity';
import { HomoGroupEntity } from './homoGroup.entity';
import { LicenseEntity } from './license.entity';
import { CompanyOSEntity } from './os.entity';
import { CompanyReportEntity } from './report.entity';
import { WorkspaceEntity } from './workspace.entity';
import { Company, CompanyPaymentTypeEnum, CompanyTypesEnum } from '.prisma/client';

export class CompanyEntity implements Company {
  @ApiProperty({ description: 'The id of the Company' })
  id: string;

  @ApiProperty({ description: 'The CNPJ of the Company' })
  cnpj: string;

  @ApiProperty({ description: 'The name of the Company' })
  name: string;

  @ApiProperty({ description: 'The fantasy name of the Company' })
  fantasy: string;

  @ApiProperty({
    description: 'The current status of the Company',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({
    description: 'The type of the Company',
    examples: ['matriz', 'filial'],
  })
  type: CompanyTypesEnum;

  @ApiProperty({
    description: 'If true, the company can administrate other companies',
  })
  isConsulting: boolean;

  @ApiProperty({ description: 'The creation date of the Company' })
  created_at: Date;

  @ApiProperty({
    description: 'The last time that the Company data was updated',
  })
  updated_at: Date;

  @ApiProperty({ description: 'The license id of the Company' })
  licenseId: number;

  @ApiProperty({ description: 'The group id of the Company' })
  groupId: number;

  @ApiProperty({ description: 'The parent company id of the Company' })
  parentCompanyId: string;

  @ApiProperty({ description: 'The creation date of the Company' })
  license?: LicenseEntity;

  @ApiProperty({ description: 'The address of the Company' })
  address?: AddressCompanyEntity;

  @ApiProperty({ description: 'The workspace related to the company' })
  workspace?: WorkspaceEntity[];

  @ApiProperty({ description: 'The employees related to the company' })
  employees?: EmployeeEntity[];

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  primary_activity?: ActivityEntity[];
  secondary_activity?: ActivityEntity[];
  environments?: EnvironmentEntity[];
  characterization?: CharacterizationEntity[];
  professionals?: ProfessionalEntity[];
  riskFactorGroupData?: RiskFactorGroupDataEntity[];
  email: string;
  logoUrl: string;
  responsibleName: string;
  phone: string;
  operationTime: string;
  activityStartDate: Date;
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
  contacts: ContactEntity[];
  covers: DocumentCoverEntity[];
  isClinic: boolean;

  employeeCount?: number;
  riskGroupCount?: number;
  homogenousGroupCount?: number;
  hierarchyCount?: number;
  professionalCount?: number;
  examCount?: number;
  usersCount?: number;
  step?: CompanyStepEnum;
  steps?: CompanyStepEnum[];
  paymentType: CompanyPaymentTypeEnum;
  paymentDay: number;
  isTaxNote: boolean;
  observationBank: string;
  companiesToClinicAvailable: CompanyClinicsEntity;
  clinicsAvailable: CompanyClinicsEntity;
  clinicExams: ExamToClinicEntity[];
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
  homogeneousGroup?: HomoGroupEntity[];
  os?: CompanyOSEntity;

  esocialEvents?: EmployeeESocialEventEntity[];
  esocialTransmissions?: EmployeeESocialBatchEntity[];

  doctorResponsible?: Partial<ProfessionalEntity>;
  tecResponsible?: Partial<ProfessionalEntity>;
  professionalsResponsibles?: Partial<ProfessionalResponsibleEntity>[];
  ambResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;

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

  mission: string;
  vision: string;
  values: string;

  activity_start_date: string;
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
    const examStep = this.examCount == 0;
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
