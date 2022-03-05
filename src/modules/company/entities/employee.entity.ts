import { ApiProperty } from '@nestjs/swagger';
import { Employee, StatusEnum } from '@prisma/client';
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

  @ApiProperty({ description: 'The workplace id of the Employee' })
  workplaceId: number;

  @ApiProperty({ description: 'The hierarchy id of the Employee' })
  hierarchyId: number;

  @ApiProperty({ description: 'The workspace related to the Employee' })
  workspace?: WorkspaceEntity;

  @ApiProperty({ description: 'The hierarchy of the Employee' })
  hierarchy?: HierarchyEntity;

  directory?: string;
  management?: string;
  sector?: string;
  sub_sector?: string;
  office?: string;
  sub_office?: string;

  constructor(partial: Partial<EmployeeEntity>) {
    Object.assign(this, partial);
  }
}
