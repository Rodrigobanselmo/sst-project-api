import {
  IRiskDataJson,
  IRiskDataJsonQui,
  QuantityTypeEnum,
} from './../../company/interfaces/risk-data-json.types';
import { ApiProperty } from '@nestjs/swagger';

import { HierarchyEntity } from '../../company/entities/hierarchy.entity';
import { HomoGroupEntity } from '../../company/entities/homoGroup.entity';
import { EpiEntity } from './epi.entity';
import { GenerateSourceEntity } from './generateSource.entity';
import { RecMedEntity } from './recMed.entity';
import { RiskFactorsEntity } from './risk.entity';
import { Prisma, RiskFactorData } from '.prisma/client';

export class RiskFactorDataEntity implements RiskFactorData {
  @ApiProperty({ description: 'The id of the Company' })
  id: string;

  @ApiProperty({ description: 'The probability of the risk data' })
  probability: number;

  @ApiProperty({ description: 'The probability of the risk data' })
  probabilityAfter: number;

  @ApiProperty({ description: 'The company id related to the risk data' })
  companyId: string;

  @ApiProperty({ description: 'The creation date of the risk data' })
  created_at: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  @ApiProperty({ description: 'The hierarchy data' })
  hierarchy?: HierarchyEntity;

  @ApiProperty({ description: 'The hierarchy id' })
  hierarchyId: string;

  @ApiProperty({ description: 'The homogeneous group data' })
  homogeneousGroup?: HomoGroupEntity;

  @ApiProperty({ description: 'The homogeneous group id' })
  homogeneousGroupId: string;

  @ApiProperty({ description: 'The risk factor data' })
  riskFactor?: RiskFactorsEntity;

  @ApiProperty({ description: 'The risk id' })
  riskId: string;

  @ApiProperty({ description: 'The risk group data id' })
  riskFactorGroupDataId: string;

  @ApiProperty({
    description: 'The array with recommendations data',
  })
  recs?: RecMedEntity[];

  @ApiProperty({
    description: 'The array with measure controls data',
  })
  engs?: RecMedEntity[];

  @ApiProperty({
    description: 'The array with measure controls data',
  })
  adms?: RecMedEntity[];

  @ApiProperty({ description: 'The array with generate source data' })
  generateSources?: GenerateSourceEntity[];

  @ApiProperty({ description: 'The array with generate source data' })
  epis?: EpiEntity[];

  json: Prisma.JsonValue;

  constructor(partial: Partial<RiskFactorDataEntity>) {
    Object.assign(this, partial);

    if (this.json && typeof this.json === 'object') {
      const json = this.json as unknown as IRiskDataJson;

      if (json.type === QuantityTypeEnum.QUI) this.quiProb(json);
    }
  }

  private quiProb(data: IRiskDataJsonQui) {
    const nr15ltProb = this.percentageCheck(data.nr15ltValue, data.nr15lt);
    const stelProb = this.percentageCheck(data.stelValue, data.stel);
    const twaProb = this.percentageCheck(data.twaValue, data.twa);

    this.probability = Math.max(nr15ltProb, stelProb, twaProb) || undefined;
  }

  private percentageCheck(value: string, limit: string) {
    if (!value || !limit) return 0;

    value = value.replace(/[^0-9.]/g, '');
    limit = limit.replace(/[^0-9.]/g, '');

    const stage = Number(value) / Number(limit);
    if (stage < 0.1) return 1;
    if (stage < 0.25) return 2;
    if (stage < 0.5) return 3;
    if (stage < 1) return 4;
    return 5;
  }
}
