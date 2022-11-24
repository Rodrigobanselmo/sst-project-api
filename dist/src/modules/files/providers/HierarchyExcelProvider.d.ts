import { HierarchyEntity } from '../../../modules/company/entities/hierarchy.entity';
declare type hierarchyMap = Record<string, HierarchyEntity & {
    children: (string | number)[];
}>;
export declare class HierarchyExcelProvider {
    transformArrayToHierarchyMapTree(hierarchies: HierarchyEntity[]): hierarchyMap;
    createTreeMapFromHierarchyStruct(hierarchies: {
        workspaceIds: string[];
        directory?: string;
        management?: string;
        sector?: string;
        sub_sector?: string;
        office?: string;
        sub_office?: string;
        ghoName?: string;
        description?: string;
        realDescription?: string;
    }[]): any;
    compare(allMap: hierarchyMap, compareMap: hierarchyMap): Record<string, any>;
}
export {};
