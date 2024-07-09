import { RiskFactorDataEntity } from '../../sst/entities/riskData.entity';
import { CharacterizationTypeEnum, CompanyCharacterization, StatusEnum } from '@prisma/client';

import { CharacterizationPhotoEntity } from './characterization-photo.entity';
import { HierarchyEntity } from './hierarchy.entity';
import { HomoGroupEntity } from './homoGroup.entity';
import { WorkspaceEntity } from './workspace.entity';
import { CharacterizationFileEntity } from './characterization-file.entity';

export class CharacterizationEntity implements CompanyCharacterization {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  type: CharacterizationTypeEnum;
  workspace?: WorkspaceEntity;
  photos?: CharacterizationPhotoEntity[];

  files?: CharacterizationFileEntity[];

  hierarchies?: HierarchyEntity[];
  riskData?: RiskFactorDataEntity[];
  homogeneousGroup?: HomoGroupEntity;
  order: number;
  considerations: string[];
  deleted_at: Date;
  updated_at: Date;
  workspaceId: string;
  companyId: string;
  activities: string[];
  paragraphs: string[];
  noiseValue: string;
  temperature: string;
  luminosity: string;
  moisturePercentage: string;
  profileName: string;
  profileParentId: string;
  profileParent?: CharacterizationEntity;
  profiles?: CharacterizationEntity[];
  status: StatusEnum;

  constructor(partial: Partial<CharacterizationEntity>) {
    Object.assign(this, partial);

    if (this.homogeneousGroup) {
      this.homogeneousGroup = new HomoGroupEntity(this.homogeneousGroup);
    }
  }
}
