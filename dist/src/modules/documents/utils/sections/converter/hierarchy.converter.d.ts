import { HomoGroupEntity } from 'src/modules/company/entities/homoGroup.entity';
import { HierarchyEntity } from '../../../../company/entities/hierarchy.entity';
export interface MapData {
    org: {
        type: string;
        typeEnum: string;
        name: string;
        id: string;
        homogeneousGroupIds: string[];
        homogeneousGroup: string;
    }[];
    allHomogeneousGroupIds: string[];
    workspace: string;
    descRh: string;
    descReal: string;
    employeesLength: number;
}
export declare type IHierarchyData = Map<string, MapData>;
export declare type IHierarchyMap = Record<string, HierarchyEntity & {
    children: string[];
}>;
export declare type IHomoGroupMap = Record<string, HomoGroupEntity>;
export declare const hierarchyConverter: (hierarchies: HierarchyEntity[]) => {
    hierarchyData: Map<string, MapData>;
    homoGroupTree: IHomoGroupMap;
    hierarchyTree: IHierarchyMap;
};
