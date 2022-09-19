import { RiskFactorGroupDataEntity } from './../../checklist/entities/riskGroupData.entity';
import { ProfessionalEntity } from './../../users/entities/professional.entity';
import {
  Company,
  CompanyPaymentTypeEnum,
  CompanyTypesEnum,
} from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { AddressCompanyEntity } from './address-company.entity';
import { EmployeeEntity } from './employee.entity';
import { LicenseEntity } from './license.entity';
import { WorkspaceEntity } from './workspace.entity';
import { EnvironmentEntity } from './environment.entity';
import { ActivityEntity } from './activity.entity';
import { CharacterizationEntity } from './characterization.entity';
import { ContractEntity } from './contract.entity';
import { ContactEntity } from './contact.entity';
import { CompanyStepEnum } from 'src/shared/constants/enum/stepCompany.enum';
import { DocumentCoverEntity } from './document-cover.entity';
import { CompanyClinicsEntity } from './company-clinics.entity';

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
  esocialStart: Date;
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
  clinicExams: any;
  riskDegree?: number;
  isGroup: boolean;
  companyGroupId: number;

  constructor(partial: Partial<CompanyEntity>) {
    Object.assign(this, partial);

    if (this.primary_activity && this.primary_activity[0]) {
      this.riskDegree = this.primary_activity[0].riskDegree;
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
    this.steps = [
      CompanyStepEnum.EXAMS,
      CompanyStepEnum.PROFESSIONALS,
      CompanyStepEnum.USERS,
      CompanyStepEnum.NONE,
    ];

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
