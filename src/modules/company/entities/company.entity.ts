import { Company, CompanyTypesEnum } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { EmployeeEntity } from './employee.entity';
import { LicenseEntity } from './license.entity';
import { WorkspaceEntity } from './workspace.entity';

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

  @ApiProperty({ description: 'The parent company id of the Company' })
  parentCompanyId: string;

  @ApiProperty({ description: 'The creation date of the Company' })
  license?: LicenseEntity;

  @ApiProperty({ description: 'The workspace related to the company' })
  workspace?: WorkspaceEntity[];

  @ApiProperty({ description: 'The employees related to the company' })
  employees?: EmployeeEntity[];

  description: string;

  constructor(partial: Partial<CompanyEntity>) {
    Object.assign(this, partial);
  }
  size: string;
  phone: string;
  legal_nature: string;
  cadastral_situation: string;
  activity_start_date: string;
  cadastral_situation_date: string;
  legal_nature_code: string;
  cadastral_situation_description: string;
  employeeCount?: number;
  riskGroupCount?: number;
}
