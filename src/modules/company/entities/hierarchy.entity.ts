import { ApiProperty } from '@nestjs/swagger';
import { Hierarchy, HierarchyEnum, StatusEnum } from '@prisma/client';
import { EmployeeHierarchyHistoryEntity } from './employee-hierarchy-history.entity';

import { EmployeeEntity } from './employee.entity';
import { HierarchyOnHomogeneousEntity, HomoGroupEntity } from './homoGroup.entity';
import { WorkspaceEntity } from './workspace.entity';
import { EmployeeExamsHistoryEntity } from './employee-exam-history.entity';

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

  @ApiProperty({ description: 'The workspace of the Hierarchy' })
  workspaces?: WorkspaceEntity[];

  @ApiProperty({ description: 'The group of the Hierarchy' })
  hierarchyOnHomogeneous?: HierarchyOnHomogeneousEntity[];

  @ApiProperty({ description: 'The group of the Hierarchy' })
  homogeneousGroups?: HomoGroupEntity[];

  @ApiProperty({ description: 'The workspace of the Hierarchy' })
  employees?: EmployeeEntity[];

  subOfficeEmployees?: EmployeeEntity[];
  workspaceIds?: string[];
  parent?: Hierarchy;
  parents?: HierarchyEntity[];
  children?: Hierarchy[];
  workspaceId?: string;
  employeesCount?: number;
  deletedAt: Date;

  subHierarchyHistory?: EmployeeHierarchyHistoryEntity[];
  hierarchyHistory?: EmployeeHierarchyHistoryEntity[];
  employeeExamsHistory?: EmployeeExamsHistoryEntity[];
  employeeExamsHistorySubOffice?: EmployeeExamsHistoryEntity[];

  constructor(partial: Partial<HierarchyEntity>) {
    Object.assign(this, partial);

    if (!this.workspaceIds) {
      this.workspaceIds = [];

      if (this.workspaces) {
        this.workspaceIds = this.workspaces.map((workspace) => workspace.id);
      }
    }

    if (this.parent) {
      this.parents = [this.parent];
      const parent = this.parent as any;

      if (parent?.parent) {
        this.parents.push(parent.parent);
        if (parent.parent?.parent) {
          this.parents.push(parent.parent.parent);
          if (parent.parent.parent?.parent) {
            this.parents.push(parent.parent.parent.parent);
            if (parent.parent.parent.parent?.parent) {
              this.parents.push(parent.parent.parent.parent.parent);
              if (parent.parent.parent.parent.parent?.parent) {
                this.parents.push(parent.parent.parent.parent.parent.parent);
              }
            }
          }
        }
      }

      if (this.workspaces) {
        this.workspaceIds = this.workspaces.map((workspace) => workspace.id);
      }
    }
  }
  refName: string;
}
