import { ApiProperty } from '@nestjs/swagger';
import {
  HierarchyOnHomogeneous,
  HomogeneousGroup,
  StatusEnum,
} from '@prisma/client';
import { HierarchyEntity } from './hierarchy.entity';
import { WorkspaceEntity } from './workspace.entity';

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

  workspaceId?: string;

  constructor(partial: Partial<HomoGroupEntity>) {
    Object.assign(this, partial);
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
