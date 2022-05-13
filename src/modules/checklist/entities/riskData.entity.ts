import { ApiProperty } from '@nestjs/swagger';

import { EpiEntity } from './Epi.entity';
import { GenerateSourceEntity } from './generateSource.entity';
import { RecMedEntity } from './recMed.entity';
import { RiskFactorData } from '.prisma/client';
import { HierarchyEntity } from '../../company/entities/hierarchy.entity';
import { HomoGroupEntity } from '../../company/entities/homoGroup.entity';
import { RiskFactorsEntity } from './risk.entity';

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

  constructor(partial: Partial<RiskFactorDataEntity>) {
    Object.assign(this, partial);
  }
}
