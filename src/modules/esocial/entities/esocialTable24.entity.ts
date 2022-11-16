import { ApiProperty } from '@nestjs/swagger';
import { EsocialTable24, RiskFactorsEnum } from '@prisma/client';

export class EsocialTable24Entity implements EsocialTable24 {
  @ApiProperty({ description: 'The id of the certification' })
  id: string;
  name: string;
  group: string;
  type: RiskFactorsEnum;
  isQuantity: boolean;

  constructor(partial: Partial<EsocialTable24Entity>) {
    Object.assign(this, partial);
  }
}
