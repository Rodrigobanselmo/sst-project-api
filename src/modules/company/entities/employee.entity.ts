import { ApiProperty } from '@nestjs/swagger';
import { Employee, Hierarchy, SexTypeEnum, StatusEnum } from '@prisma/client';
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
  hierarchy?: HierarchyEntity;

  subOffices?: HierarchyEntity[];
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
  examsHistory?: EmployeeExamsHistoryEntity[];
  hierarchyHistory?: EmployeeHierarchyHistoryEntity[];

  constructor(partial: Partial<EmployeeEntity> & { hierarchy?: Hierarchy }) {
    Object.assign(this, partial);

    if (this.hierarchy) {
      this.hierarchy = new HierarchyEntity(this.hierarchy);
    }
  }
}
