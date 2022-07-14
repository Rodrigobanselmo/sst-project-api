import { ApiProperty } from '@nestjs/swagger';

import { Prisma, RiskFactors, RiskFactorsEnum } from '.prisma/client';
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

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  risk: string;
  symptoms: string;

  isEmergency: boolean;
  json: Prisma.JsonValue;
  exame: string;
  method: string;
  unit: string;
  cas: string;
  breather: string;
  nr15lt: string;
  twa: string;
  stel: string;
  vmp: string;
  ipvs: string;
  pv: string;
  pe: string;
  carnogenicityACGIH: string;
  carnogenicityLinach: string;

  constructor(partial: Partial<RiskFactorsEntity>) {
    Object.assign(this, partial);
    this.vmp = String(this.getVMP(this?.nr15lt || ''));
  }

  private getVMP(nr15lt?: string) {
    if (!nr15lt) return '';
    if (nr15lt == '-') return '';

    const LT = Number(nr15lt.replace(/[^0-9.]/g, ''));

    if (LT <= 1) return 3 * LT;
    if (LT <= 10) return 2 * LT;
    if (LT <= 100) return 1.5 * LT;
    if (LT <= 1000) return 1.25 * LT;
    return 1.1 * LT;
  }
}
