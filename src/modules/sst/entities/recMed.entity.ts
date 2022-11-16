import { ApiProperty } from '@nestjs/swagger';

import { RecMed, RecTypeEnum } from '.prisma/client';
import { MeasuresTypeEnum, StatusEnum } from '@prisma/client';
import { EngsRiskDataEntity } from './engsRiskData.entity';

export class RecMedEntity implements RecMed {
  @ApiProperty({
    description: 'The id of the recommendation or control measure',
  })
  id: string;

  @ApiProperty({
    description: 'The id of the parent risk',
  })
  riskId: string;

  @ApiProperty({ description: 'the recommendation description' })
  recName: string;

  @ApiProperty({ description: 'the control measure description' })
  medName: string;

  @ApiProperty({
    description: 'The company id related to the recommendation or control measure',
  })
  companyId: string;

  @ApiProperty({
    description: 'If was created from one of simple professionals',
  })
  system: boolean;

  @ApiProperty({
    description: 'The current control measure type',
    examples: ['ADM', 'ENG'],
  })
  medType: MeasuresTypeEnum;

  @ApiProperty({
    description: 'The current status of the recommendation or control measure',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk' })
  created_at: Date;

  @ApiProperty({ description: 'The generate source id related' })
  generateSourceId: string;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  recType: RecTypeEnum;

  engsRiskData?: EngsRiskDataEntity;

  constructor(partial: Partial<RecMedEntity>) {
    Object.assign(this, partial);
  }
}
