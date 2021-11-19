import { Company } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { WorkspaceEntity } from './workspace.entity';

export class CompanyEntity implements Company {
  @ApiProperty({ description: 'The id of the Company' })
  id: number;

  @ApiProperty({ description: 'The CNPJ of the Company' })
  cnpj: string;

  @ApiProperty({ description: 'The name of the Company' })
  name: string;

  @ApiProperty({ description: 'The fantasy name of the Company' })
  fantasy: string;

  @ApiProperty({
    description: 'The current status of the Company',
    examples: ['active', 'pending', 'canceled'],
  })
  status: string;

  @ApiProperty({
    description: 'The type of the Company',
    examples: ['matriz', 'filial'],
  })
  type: string;

  @ApiProperty({
    description: 'If true, the company can administrate other companies',
  })
  isConsulting: boolean;

  @ApiProperty({ description: 'The creation date of the Company' })
  created_at: Date;

  @ApiProperty({
    description: 'The last time that the Company data was updated',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'The workspace related to the company' })
  workspace?: WorkspaceEntity[];

  constructor(partial: Partial<CompanyEntity>) {
    Object.assign(this, partial);
  }
}
