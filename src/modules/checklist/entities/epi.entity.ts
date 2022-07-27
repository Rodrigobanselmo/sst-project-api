import { ApiProperty } from '@nestjs/swagger';

import { Epi } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
import { EpiRiskDataEntity } from './epiRiskData';

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
  description: string;

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

  @ApiProperty({ description: 'The creation date of the epi' })
  national: boolean;

  @ApiProperty({ description: 'The report of the epi' })
  report: string;

  @ApiProperty({ description: 'The report restriction of the epi' })
  restriction: string;

  @ApiProperty({ description: 'The observations about the epi report' })
  observation: string;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  epiRiskData: EpiRiskDataEntity;

  constructor(partial: Partial<EpiEntity>) {
    Object.assign(this, partial);
  }
}
