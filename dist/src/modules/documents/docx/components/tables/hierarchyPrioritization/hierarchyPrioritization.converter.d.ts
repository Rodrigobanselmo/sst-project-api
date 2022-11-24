import { HierarchyEnum, HomoTypeEnum } from '@prisma/client';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
export interface IHierarchyPrioritizationOptions {
    isByGroup?: boolean;
    hierarchyType?: HierarchyEnum;
    homoType?: HomoTypeEnum | HomoTypeEnum[];
}
export declare const hierarchyPrioritizationConverter: (riskGroup: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData, hierarchyTree: IHierarchyMap, { hierarchyType, isByGroup, homoType }: IHierarchyPrioritizationOptions) => {
    bodyData: bodyTableProps[][];
    headerData: headerTableProps[];
};
