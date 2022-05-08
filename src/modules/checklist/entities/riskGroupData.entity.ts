import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

import { RiskFactorGroupData } from '.prisma/client';
import { RiskFactorDataEntity } from './riskData.entity';

export class RiskFactorGroupDataEntity implements RiskFactorGroupData {
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
  data?: RiskFactorDataEntity[];

  constructor(partial: Partial<RiskFactorGroupDataEntity>) {
    Object.assign(this, partial);
  }
}
