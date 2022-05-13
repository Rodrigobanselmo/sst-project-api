import { ApiProperty } from '@nestjs/swagger';
import { Hierarchy, HierarchyEnum, StatusEnum } from '@prisma/client';
import { WorkspaceEntity } from './workspace.entity';

export class HierarchyEntity implements Hierarchy {
  @ApiProperty({ description: 'The id of the Hierarchy' })
  id: string;

  @ApiProperty({ description: 'The name of the Hierarchy' })
  name: string;

  @ApiProperty({ description: 'The description of the Hierarchy' })
  description: string;

  @ApiProperty({ description: 'The real description of the Hierarchy' })
  realDescription: string;

  @ApiProperty({
    description: 'The current status of the Hierarchy',
    examples: [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
  })
  status: StatusEnum;

  @ApiProperty({
    description: 'The company id of the Hierarchy',
  })
  companyId: string;

  @ApiProperty({ description: 'The creation date of the Hierarchy' })
  created_at: Date;

  @ApiProperty({
    description: 'The current status of the Hierarchy',
    examples: [...Object.values(HierarchyEnum)],
  })
  type: HierarchyEnum;

  @ApiProperty({ description: 'The parent id of the Hierarchy' })
  parentId: string;

  @ApiProperty({ description: 'The workplace id of the Hierarchy' })
  workplaceId: string;

  @ApiProperty({ description: 'The workplace of the Hierarchy' })
  workplace?: WorkspaceEntity;

  constructor(partial: Partial<HierarchyEntity>) {
    Object.assign(this, partial);
  }
}
