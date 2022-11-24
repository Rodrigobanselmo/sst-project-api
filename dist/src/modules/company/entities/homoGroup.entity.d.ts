import { RiskFactorDataEntity } from '../../sst/entities/riskData.entity';
import { HierarchyOnHomogeneous, HomogeneousGroup, HomoTypeEnum, StatusEnum } from '@prisma/client';
import { HierarchyEntity } from './hierarchy.entity';
import { WorkspaceEntity } from './workspace.entity';
import { CharacterizationEntity } from './characterization.entity';
import { EnvironmentEntity } from './environment.entity';
export declare class HomoGroupEntity implements HomogeneousGroup {
    id: string;
    name: string;
    description: string;
    status: StatusEnum;
    companyId: string;
    created_at: Date;
    hierarchyOnHomogeneous?: HierarchyOnHomogeneousEntity[];
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
    constructor(partial: Partial<HomoGroupEntity>);
}
export declare class HierarchyOnHomogeneousEntity implements HierarchyOnHomogeneous {
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
    constructor(partial: Partial<HomoGroupEntity>);
}
