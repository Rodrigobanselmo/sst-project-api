import { EmployeeHierarchyHistory, EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';
import { EmployeeEntity } from './employee.entity';
import { HierarchyEntity } from './hierarchy.entity';
export declare class EmployeeHierarchyHistoryEntity implements EmployeeHierarchyHistory {
    id: number;
    motive: EmployeeHierarchyMotiveTypeEnum;
    startDate: Date;
    hierarchyId: string;
    employeeId: number;
    created_at: Date;
    updated_at: Date;
    directory?: string;
    management?: string;
    sector?: string;
    office?: string;
    deletedAt: Date;
    employee?: EmployeeEntity;
    hierarchy?: HierarchyEntity;
    subHierarchies?: Partial<HierarchyEntity>[];
    constructor(partial: Partial<EmployeeHierarchyHistoryEntity>);
}
export declare const historyRules: Record<any, any>;
