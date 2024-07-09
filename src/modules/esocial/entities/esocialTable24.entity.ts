import { EsocialTable24, RiskFactorsEnum } from '@prisma/client';

export class EsocialTable24Entity implements EsocialTable24 {
  id: string;
  name: string;
  group: string;
  type: RiskFactorsEnum;
  isQuantity: boolean;

  constructor(partial: Partial<EsocialTable24Entity>) {
    Object.assign(this, partial);
  }
}
