import { ApiProperty } from '@nestjs/swagger';
import { RiskFactorDocument, StatusEnum } from '@prisma/client';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';

export class RiskDocumentEntity implements RiskFactorDocument {
  @ApiProperty({ description: 'The id of the risk group data' })
  id: string;

  @ApiProperty({ description: 'The name of the risk group data' })
  name: string;

  @ApiProperty({ description: 'The company id related to the risk group data' })
  companyId: string;

  @ApiProperty({
    description: 'The current status of the risk group data',
    examples: ['ACTIVE', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk group data' })
  created_at: Date;

  @ApiProperty({
    description: 'The array with risks data',
  })
  company?: Partial<CompanyEntity>;

  fileUrl: string;
  description: string;
  version: string;
  riskGroupId: string;
  updated_at: Date;

  constructor(partial: Partial<RiskDocumentEntity>) {
    Object.assign(this, partial);
  }
}
