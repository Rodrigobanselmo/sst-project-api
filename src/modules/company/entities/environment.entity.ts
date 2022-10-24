import { ApiProperty } from '@nestjs/swagger';
import {
  CharacterizationTypeEnum,
  CompanyCharacterization,
} from '@prisma/client';

import { RiskFactorDataEntity } from '../../sst/entities/riskData.entity';
import { CharacterizationPhotoEntity } from './characterization-photo.entity';
import { HierarchyEntity } from './hierarchy.entity';
import { HomoGroupEntity } from './homoGroup.entity';
import { WorkspaceEntity } from './workspace.entity';

export class EnvironmentEntity implements CompanyCharacterization {
  @ApiProperty({ description: 'The id of the company environment' })
  id: string;

  @ApiProperty({ description: 'The name of the company environment' })
  name: string;

  @ApiProperty({ description: 'The description of the company environment' })
  description: string | null;

  @ApiProperty({ description: 'The creation date of the company environment' })
  created_at: Date;

  @ApiProperty({
    description: 'The type of the company environment',
    examples: [...Object.values(CharacterizationTypeEnum)],
  })
  type: CharacterizationTypeEnum;

  @ApiProperty({ description: 'The workspace of the company environment' })
  workspace?: WorkspaceEntity;

  @ApiProperty({ description: 'The photos related to the company environment' })
  photos?: CharacterizationPhotoEntity[];

  @ApiProperty({ description: 'The group of the environment' })
  homogeneousGroup?: HomoGroupEntity;

  hierarchies?: HierarchyEntity[];
  riskData?: RiskFactorDataEntity[];
  noiseValue: string;
  order: number;
  temperature: string;
  moisturePercentage: string;
  luminosity: string;
  deleted_at: Date;
  updated_at: Date;
  workspaceId: string;
  activities: string[];
  considerations: string[];
  paragraphs: string[];
  companyId: string;
  profileName: string;
  profileParentId: string;
  profileParent?: EnvironmentEntity;
  profiles?: EnvironmentEntity[];

  constructor(partial: Partial<EnvironmentEntity>) {
    Object.assign(this, partial);
  }
}
