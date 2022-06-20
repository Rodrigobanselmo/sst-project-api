import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
declare type IHierarchyDataRecord<T> = {
    data: IHierarchyPlan<T>;
    name: string;
    type: string;
};
export declare type IHierarchyPlan<T> = Record<string, IHierarchyDataRecord<T>>;
export declare const hierarchyPlanConverter: (hierarchyData: IHierarchyData, homoGroupTree: IHomoGroupMap) => {
    bodyData: bodyTableProps[][];
    headerData: headerTableProps[];
};
export {};
