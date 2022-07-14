import { Prisma, Workspace } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { AddressEntity } from './address.entity';
import { CompanyEntity } from './company.entity';

export class WorkspaceEntity implements Workspace {
  @ApiProperty({ description: 'The id of the Workspace' })
  id: string;

  @ApiProperty({ description: 'The name of the Workspace' })
  name: string;

  @ApiProperty({
    description: 'The current status of the Workspace',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the Workspace' })
  created_at: Date;

  @ApiProperty({
    description: 'The last time that the Workspace data was updated',
  })
  updated_at: Date;

  @ApiProperty({ description: 'The company id related to the Workspace' })
  companyId: string;

  @ApiProperty({ description: 'The address related to the Workspace' })
  address?: AddressEntity;

  @ApiProperty({ description: 'The company related to the workspace' })
  company?: CompanyEntity;

  description: string;
  employeeCount?: number;

  constructor(partial: Partial<WorkspaceEntity>) {
    Object.assign(this, partial);
  }
  companyJson: Prisma.JsonValue;
  isOwner: boolean;
  cnpj: string;
  abbreviation: string;
}
