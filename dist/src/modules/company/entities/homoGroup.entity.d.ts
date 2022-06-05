import { HierarchyOnHomogeneous, HomogeneousGroup, StatusEnum } from '@prisma/client';
import { HierarchyEntity } from './hierarchy.entity';
import { WorkspaceEntity } from './workspace.entity';
export declare class HomoGroupEntity implements HomogeneousGroup {
    id: string;
    name: string;
    description: string;
    status: StatusEnum;
    companyId: string;
    created_at: Date;
    hierarchyOnHomogeneous?: HierarchyOnHomogeneousEntity[];
    hierarchies?: HierarchyEntity[];
    workspaceId?: string;
    workspaceIds?: string[];
    employeeCount?: number;
    constructor(partial: Partial<HomoGroupEntity>);
}
export declare class HierarchyOnHomogeneousEntity implements HierarchyOnHomogeneous {
    hierarchyId: string;
    homogeneousGroupId: string;
    workspaceId: string;
    hierarchy?: HierarchyEntity;
    workspace?: WorkspaceEntity;
    homogeneousGroup?: HomoGroupEntity;
    constructor(partial: Partial<HomoGroupEntity>);
}
