import { Employee, StatusEnum } from '@prisma/client';
import { HierarchyEntity } from './hierarchy.entity';
import { WorkspaceEntity } from './workspace.entity';
export declare class EmployeeEntity implements Employee {
    id: number;
    name: string;
    cpf: string;
    status: StatusEnum;
    companyId: string;
    created_at: Date;
    updated_at: Date;
    workplaceId: string;
    hierarchyId: string;
    workspace?: WorkspaceEntity;
    hierarchy?: HierarchyEntity;
    directory?: string;
    management?: string;
    sector?: string;
    sub_sector?: string;
    office?: string;
    sub_office?: string;
    constructor(partial: Partial<EmployeeEntity>);
}
