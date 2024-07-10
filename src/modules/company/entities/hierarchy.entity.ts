import { Hierarchy, HierarchyEnum, StatusEnum } from '@prisma/client';
import { EmployeeHierarchyHistoryEntity } from './employee-hierarchy-history.entity';

import { EmployeeEntity } from './employee.entity';
import { HierarchyOnHomogeneousEntity, HomoGroupEntity } from './homoGroup.entity';
import { WorkspaceEntity } from './workspace.entity';
import { EmployeeExamsHistoryEntity } from './employee-exam-history.entity';

export class HierarchyEntity implements Hierarchy {
  id: string;
  name: string;
  description: string;
  realDescription: string;
  status: StatusEnum;
  companyId: string;
  created_at: Date;
  type: HierarchyEnum;
  parentId: string;
  workspaces?: WorkspaceEntity[];
  hierarchyOnHomogeneous?: HierarchyOnHomogeneousEntity[];
  homogeneousGroups?: HomoGroupEntity[];
  employees?: EmployeeEntity[];

  subOfficeEmployees?: EmployeeEntity[];
  workspaceIds?: string[];
  parent?: Hierarchy;
  parents?: HierarchyEntity[];
  children?: Hierarchy[];
  workspaceId?: string;
  employeesCount?: number;
  deletedAt: Date;
  updated_at: Date;

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
