import { ApiProperty } from '@nestjs/swagger';

import { GenerateSource } from '.prisma/client';
import { StatusEnum } from '@prisma/client';

export class GenerateSourceEntity implements GenerateSource {
  @ApiProperty({
    description: 'The id of the generate source or control measure',
  })
  id: number;

  @ApiProperty({
    description: 'The id of the parent risk',
  })
  riskId: number;

  @ApiProperty({ description: 'the generate source description' })
  name: string;

  @ApiProperty({
    description:
      'The company id related to the generate source or control measure',
  })
  companyId: string;

  @ApiProperty({
    description: 'If was created from one of simple professionals',
  })
  system: boolean;

  @ApiProperty({
    description: 'The current status of the generate source or control measure',
    examples: ['ACTIVE', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk' })
  created_at: Date;

  constructor(partial: Partial<GenerateSourceEntity>) {
    Object.assign(this, partial);
  }
}
