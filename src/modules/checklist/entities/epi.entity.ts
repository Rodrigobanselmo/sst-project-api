import { ApiProperty } from '@nestjs/swagger';

import { Epi } from '.prisma/client';
import { StatusEnum } from '@prisma/client';

export class EpiEntity implements Epi {
  @ApiProperty({
    description: 'The id of the epi',
  })
  id: number;

  @ApiProperty({ description: 'the ca number' })
  ca: string;

  @ApiProperty({ description: 'the equipment description' })
  equipment: string;

  @ApiProperty({ description: 'the epi description' })
  desc: string;

  @ApiProperty({ description: 'if api is valid' })
  isValid: boolean;

  @ApiProperty({
    description: 'The current status of the epi',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The expired date of the epi' })
  expiredDate: Date;

  @ApiProperty({ description: 'The creation date of the epi' })
  created_at: Date;

  constructor(partial: Partial<EpiEntity>) {
    Object.assign(this, partial);
  }
}
