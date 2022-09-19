import { RiskFactorDataEntity } from './../../checklist/entities/riskData.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  HierarchyOnHomogeneous,
  HomogeneousGroup,
  HomoTypeEnum,
  StatusEnum,
} from '@prisma/client';
import { HierarchyEntity } from './hierarchy.entity';
import { WorkspaceEntity } from './workspace.entity';
import { CharacterizationEntity } from './characterization.entity';
import { EnvironmentEntity } from './environment.entity';

export class HomoGroupEntity implements HomogeneousGroup {
  @ApiProperty({ description: 'The id of the HomogeneousGroup' })
  id: string;

  @ApiProperty({ description: 'The name of the HomogeneousGroup' })
  name: string;

  @ApiProperty({ description: 'The name of the HomogeneousGroup' })
  description: string;

  @ApiProperty({
    description: 'The current status of the HomogeneousGroup',
    examples: [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
  })
  status: StatusEnum;

  @ApiProperty({
    description: 'The company id of the HomogeneousGroup',
  })
  companyId: string;

  @ApiProperty({ description: 'The creation date of the HomogeneousGroup' })
  created_at: Date;

  hierarchyOnHomogeneous?: HierarchyOnHomogeneousEntity[];

  @ApiProperty({ description: 'The hierarchies of the HomogeneousGroup' })
  hierarchies?: HierarchyEntity[];

  type: HomoTypeEnum;
  workspaceId?: string;
  workspaceIds?: string[];
  riskFactorData?: RiskFactorDataEntity[];
  characterization?: CharacterizationEntity;
  environment?: EnvironmentEntity;
  hierarchy?: HierarchyEntity;

  employeeCount?: number;

  constructor(partial: Partial<HomoGroupEntity>) {
    Object.assign(this, partial);

    if (
      this.type === 'HIERARCHY' &&
      !this.hierarchy &&
      this.hierarchyOnHomogeneous &&
      this.hierarchyOnHomogeneous[0]
    ) {
      this.hierarchy = new HierarchyEntity(
        this.hierarchyOnHomogeneous[0].hierarchy,
      );
    }
  }
}

export class HierarchyOnHomogeneousEntity implements HierarchyOnHomogeneous {
  hierarchyId: string;
  homogeneousGroupId: string;
  workspaceId: string;
  hierarchy?: HierarchyEntity;
  workspace?: WorkspaceEntity;
  homogeneousGroup?: HomoGroupEntity;

  constructor(partial: Partial<HomoGroupEntity>) {
    Object.assign(this, partial);
  }
}
