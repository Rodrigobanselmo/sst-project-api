import { HomoTypeEnum } from '@prisma/client';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
export declare type ConverterProps = {
    showHomogeneous?: boolean;
    showHomogeneousDescription?: boolean;
    showDescription?: boolean;
    type?: HomoTypeEnum | HomoTypeEnum[] | undefined;
    groupIdFilter?: string | undefined;
};
declare type IHierarchyDataRecord<T> = {
    data: IHierarchyPlan<T>;
    name: string;
    type: string;
    numEmployees: string;
    description: string;
};
export declare type IHierarchyPlan<T> = Record<string, IHierarchyDataRecord<T>>;
export declare const hierarchyPlanConverter: (hierarchyData: IHierarchyData, homoGroupTree: IHomoGroupMap, { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter }?: ConverterProps) => {
    bodyData: bodyTableProps[][];
    headerData: headerTableProps[];
};
export {};
