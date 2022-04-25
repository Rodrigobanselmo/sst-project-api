import { ApiProperty } from '@nestjs/swagger';

import { AdmMeasures } from '.prisma/client';
import { StatusEnum } from '@prisma/client';

export class AdmMeasuresEntity implements AdmMeasures {
  @ApiProperty({
    description: 'The id of the recommendation or control measure',
  })
  id: string;

  @ApiProperty({
    description: 'The id of the parent risk',
  })
  riskId: string;

  @ApiProperty({ description: 'the recommendation description' })
  name: string;

  @ApiProperty({
    description:
      'The company id related to the recommendation or control measure',
  })
  companyId: string;

  @ApiProperty({
    description: 'If was created from one of simple professionals',
  })
  system: boolean;

  @ApiProperty({
    description: 'The current status of the recommendation or control measure',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk' })
  created_at: Date;

  @ApiProperty({ description: 'The generate source id related' })
  generateSourceId: string;

  constructor(partial: Partial<AdmMeasuresEntity>) {
    Object.assign(this, partial);
  }
}
