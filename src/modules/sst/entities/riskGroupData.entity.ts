import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

import { CompanyEntity } from '../../company/entities/company.entity';
import { RiskFactorDataEntity } from './riskData.entity';
import { RiskFactorGroupData } from '.prisma/client';

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
  data?: Partial<RiskFactorDataEntity>[];

  @ApiProperty({
    description: 'The array with risks data',
  })
  company?: Partial<CompanyEntity>;

  constructor(partial: Partial<RiskFactorGroupDataEntity>) {
    Object.assign(this, partial);

    if (partial?.data) {
      this.data = partial.data.map((d) => new RiskFactorDataEntity(d));
    }
  }
}
