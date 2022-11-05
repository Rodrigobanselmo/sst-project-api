import { RiskFactorDataEntity } from '../../sst/entities/riskData.entity';
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
  deletedAt: Date;

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

    if (this.hierarchyOnHomogeneous && !this.hierarchies) {
      this.hierarchies = Object.values(
        this.hierarchyOnHomogeneous.reduce((acc, curr) => {
          if (!curr.hierarchy) return acc;
          if (!acc[curr.hierarchyId]) acc[curr.hierarchyId] = curr.hierarchy;
          if (!acc[curr.hierarchyId].hierarchyOnHomogeneous)
            acc[curr.hierarchyId].hierarchyOnHomogeneous = [];

          delete curr.hierarchy;
          acc[curr.hierarchyId].hierarchyOnHomogeneous.push(curr);
          return acc;
        }, {} as Record<string, HierarchyEntity>),
      );
    }
  }
}

export class HierarchyOnHomogeneousEntity implements HierarchyOnHomogeneous {
  id: number;
  hierarchyId: string;
  homogeneousGroupId: string;
  workspaceId: string;
  hierarchy?: HierarchyEntity;
  workspace?: WorkspaceEntity;
  homogeneousGroup?: HomoGroupEntity;
  endDate: Date;
  startDate: Date;
  deletedAt: Date;

  constructor(partial: Partial<HomoGroupEntity>) {
    Object.assign(this, partial);
  }
}
