import { ApiProperty } from '@nestjs/swagger';
import { Company, Employee, Hierarchy, SexTypeEnum, StatusEnum } from '@prisma/client';
import { EmployeePPPHistoryEntity } from './employee-ppp-history.entity';
import { CompanyEntity } from './company.entity';
import { EmployeeExamsHistoryEntity } from './employee-exam-history.entity';
import { EmployeeHierarchyHistoryEntity } from './employee-hierarchy-history.entity';
import { HierarchyEntity } from './hierarchy.entity';

import { WorkspaceEntity } from './workspace.entity';

export class EmployeeEntity implements Employee {
  @ApiProperty({ description: 'The id of the Employee' })
  id: number;

  @ApiProperty({ description: 'The name of the Employee' })
  name: string;

  @ApiProperty({ description: 'The cpf name of the Employee' })
  cpf: string;

  @ApiProperty({
    description: 'The current status of the Employee',
    examples: ['ACTIVE', 'INACTIVE'],
  })
  status: StatusEnum;

  @ApiProperty({
    description: 'The company id of the employee',
  })
  companyId: string;

  @ApiProperty({ description: 'The creation date of the Employee' })
  created_at: Date;

  @ApiProperty({
    description: 'The last time that the Employee data was updated',
  })
  updated_at: Date;

  @ApiProperty({ description: 'The hierarchy id of the Employee' })
  hierarchyId: string;

  @ApiProperty({ description: 'The workspaces related to the Employee' })
  workspaces?: WorkspaceEntity[];

  @ApiProperty({ description: 'The hierarchy of the Employee' })
  hierarchy?: Partial<HierarchyEntity>;

  subOffices?: Partial<HierarchyEntity>[];
  directory?: string;
  management?: string;
  sector?: string;
  sub_sector?: string;
  office?: string;
  sub_office?: string;

  esocialCode: string;
  socialName: string;
  nickname: string;
  phone: string;
  email: string;
  isComorbidity: boolean;
  sex: SexTypeEnum;
  cidId: string;
  shiftId: number;
  birthday: Date;
  admissionDate: Date;
  lastExam: Date;
  expiredDateExam: Date;
  // sendEvent: boolean;
  company?: CompanyEntity;
  examsHistory?: EmployeeExamsHistoryEntity[];
  hierarchyHistory?: EmployeeHierarchyHistoryEntity[];
  pppHistory?: EmployeePPPHistoryEntity[];

  constructor(
    partial: Partial<Omit<EmployeeEntity, 'company'>> & {
      hierarchy?: Hierarchy;
      company?: Partial<Company>;
    },
  ) {
    Object.assign(this, partial);

    if (this.hierarchy) {
      this.hierarchy = new HierarchyEntity(this.hierarchy);
    }

    if (this.company) {
      this.company = new CompanyEntity(this.company);
    }

    if (this.examsHistory) {
      this.examsHistory = this.examsHistory.map((examsHistory) => new EmployeeExamsHistoryEntity(examsHistory));
    }

    if (this.hierarchyHistory) {
      this.hierarchyHistory = this.hierarchyHistory.map((hierarchyHistory) => new EmployeeHierarchyHistoryEntity(hierarchyHistory));
    }
  }
}
