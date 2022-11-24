import { HierarchyEnum } from '@prisma/client';
import { HomoGroupEntity } from '../../../../modules/company/entities/homoGroup.entity';
import { HierarchyEntity } from '../../../company/entities/hierarchy.entity';
import { EnvironmentEntity } from './../../../company/entities/environment.entity';
export interface HierarchyMapData {
    org: {
        type: string;
        typeEnum: HierarchyEnum;
        name: string;
        id: string;
        homogeneousGroupIds: string[];
        homogeneousGroup: string;
        environments: string;
    }[];
    allHomogeneousGroupIds: string[];
    workspace: string;
    descRh: string;
    descReal: string;
    employeesLength: number;
}
export declare type IHierarchyData = Map<string, HierarchyMapData>;
export declare type IHierarchyMap = Record<string, HierarchyEntity & {
    children: string[];
}>;
export declare type IHomoGroupMap = Record<string, HomoGroupEntity>;
export declare const hierarchyConverter: (hierarchies: HierarchyEntity[], environments?: EnvironmentEntity[], { workspaceId }?: {
    workspaceId?: string;
}) => {
    hierarchyData: Map<string, HierarchyMapData>;
    hierarchyHighLevelsData: Map<string, HierarchyMapData>;
    homoGroupTree: IHomoGroupMap;
    hierarchyTree: IHierarchyMap;
};
