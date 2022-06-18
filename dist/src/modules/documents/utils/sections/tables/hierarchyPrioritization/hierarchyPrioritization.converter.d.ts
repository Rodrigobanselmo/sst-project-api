import { HierarchyEnum } from '@prisma/client';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
export interface IHierarchyPrioritizationOptions {
    isByGroup?: boolean;
    hierarchyType?: HierarchyEnum;
}
export declare const hierarchyPrioritizationConverter: (riskGroup: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData, { hierarchyType, isByGroup, }: IHierarchyPrioritizationOptions) => {
    bodyData: bodyTableProps[][];
    headerData: headerTableProps[];
};
