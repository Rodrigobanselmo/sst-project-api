import { Hierarchy } from '@prisma/client';
export declare type IHierarchyTree = Record<string, Hierarchy & {
    children: (string | number)[];
}>;
