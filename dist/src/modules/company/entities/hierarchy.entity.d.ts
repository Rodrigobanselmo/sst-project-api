import { Hierarchy, HierarchyEnum, StatusEnum } from '@prisma/client';
import { EmployeeEntity } from './employee.entity';
import { HomoGroupEntity } from './homoGroup.entity';
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
    workplaceId: string;
    workplace?: WorkspaceEntity;
    homogeneousGroups?: HomoGroupEntity[];
    employees?: EmployeeEntity[];
    constructor(partial: Partial<HierarchyEntity>);
}
