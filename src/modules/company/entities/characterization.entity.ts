import { ApiProperty } from '@nestjs/swagger';
import {
  CharacterizationTypeEnum,
  CompanyCharacterization,
} from '@prisma/client';

import { CharacterizationPhotoEntity } from './characterization-photo.entity';
import { HomoGroupEntity } from './homoGroup.entity';
import { WorkspaceEntity } from './workspace.entity';

export class CharacterizationEntity implements CompanyCharacterization {
  @ApiProperty({ description: 'The id of the workstation' })
  id: string;

  @ApiProperty({ description: 'The name of the workstation' })
  name: string;

  @ApiProperty({ description: 'The description of the workstation' })
  description: string | null;

  @ApiProperty({ description: 'The creation date of the workstation' })
  created_at: Date;

  @ApiProperty({
    description: 'The type of the workstation',
    examples: [...Object.values(CharacterizationTypeEnum)],
  })
  type: CharacterizationTypeEnum;

  @ApiProperty({ description: 'The workspace of the workstation' })
  workspace?: WorkspaceEntity;

  @ApiProperty({ description: 'The photos related to the workstation' })
  photos?: CharacterizationPhotoEntity[];

  homogeneousGroup?: HomoGroupEntity;
  considerations: string[];
  deleted_at: Date;
  updated_at: Date;
  workspaceId: string;
  companyId: string;

  constructor(partial: Partial<CharacterizationEntity>) {
    Object.assign(this, partial);
  }
}
