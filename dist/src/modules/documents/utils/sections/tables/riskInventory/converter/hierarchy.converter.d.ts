import { HierarchyEntity } from '../../../../../../../modules/company/entities/hierarchy.entity';
export interface MapData {
    org: {
        type: string;
        name: string;
        homogeneousGroup: string;
    }[];
    workspace: string;
    descRh: string;
    descReal: string;
    employeesLength: number;
}
export declare type IHierarchyData = Map<string, MapData>;
export declare const hierarchyConverter: (hierarchies: HierarchyEntity[]) => Map<string, MapData>;
