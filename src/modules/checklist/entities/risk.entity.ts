import { ApiProperty } from '@nestjs/swagger';

import { RiskFactors, RiskFactorsEnum } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
import { RecMedEntity } from './recMed.entity';
import { GenerateSourceEntity } from './generateSource.entity';

export class RiskFactorsEntity implements RiskFactors {
  @ApiProperty({ description: 'The id of the Company' })
  id: string;

  @ApiProperty({ description: 'The name of the risk' })
  name: string;

  @ApiProperty({ description: 'The severity of the rik' })
  severity: number;

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
    description: 'If represent all risks',
  })
  representAll: boolean;

  @ApiProperty({
    description: 'The current status of the risk',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk' })
  created_at: Date;

  @ApiProperty({ description: 'The appendix date of the risk' })
  appendix: string;

  @ApiProperty({ description: 'The propagation array of the risk' })
  propagation: string[];

  @ApiProperty({
    description: 'The array with recommendations and measure controls data',
  })
  recMed?: RecMedEntity[];

  @ApiProperty({ description: 'The array with generate source data' })
  generateSource?: GenerateSourceEntity[];

  risk: string;

  constructor(partial: Partial<RiskFactorsEntity>) {
    Object.assign(this, partial);
  }
  exame: string;
  symptoms: string;
  method: string;
  unit: string;
  cas: string;
  breather: string;
  nr15lt: string;
  twa: string;
  stel: string;
  ipvs: string;
  pv: string;
  pe: string;
  carnogenicityACGIH: string;
  carnogenicityLinach: string;
}
