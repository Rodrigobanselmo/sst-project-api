import { Hierarchy, HierarchyEnum, StatusEnum } from '@prisma/client';
import { EmployeeHierarchyHistoryEntity } from './employee-hierarchy-history.entity';
import { EmployeeEntity } from './employee.entity';
import { HierarchyOnHomogeneousEntity, HomoGroupEntity } from './homoGroup.entity';
import { WorkspaceEntity } from './workspace.entity';
export declare class HierarchyEntity implements Hierarchy {
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
    subHierarchyHistory?: EmployeeHierarchyHistoryEntity[];
    hierarchyHistory?: EmployeeHierarchyHistoryEntity[];
    constructor(partial: Partial<HierarchyEntity>);
    refName: string;
}
