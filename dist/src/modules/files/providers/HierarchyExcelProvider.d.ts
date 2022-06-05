import { Hierarchy } from '@prisma/client';
import { HierarchyEntity } from '../../../modules/company/entities/hierarchy.entity';
declare type hierarchyMap = Record<string, Hierarchy & {
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
    }[]): any;
    compare(allMap: hierarchyMap, compareMap: hierarchyMap): Record<string, any>;
}
export {};
