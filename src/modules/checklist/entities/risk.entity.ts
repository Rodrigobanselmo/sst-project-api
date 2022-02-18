import { ApiProperty } from '@nestjs/swagger';

import { RiskFactors, RiskFactorsEnum } from '.prisma/client';
import { StatusEnum } from '@prisma/client';

export class RiskFactorsEntity implements RiskFactors {
  @ApiProperty({ description: 'The id of the Company' })
  id: number;

  @ApiProperty({ description: 'The parent company id of the Company' })
  name: string;

  @ApiProperty({
    description: 'The current type of the risk',
    examples: ['BIO', 'QUI', 'FIS'],
  })
  type: RiskFactorsEnum;

  @ApiProperty({ description: 'The company id related to the risk' })
  companyId: string;

  @ApiProperty({
    description: 'If risk was created from one of simple professionals',
  })
  system: boolean;

  @ApiProperty({
    description: 'The current status of the risk',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk' })
  created_at: Date;

  constructor(partial: Partial<RiskFactorsEntity>) {
    Object.assign(this, partial);
  }
}
