import { HierarchyEnum } from '@prisma/client';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
export interface IHierarchyRiskOptions {
    hierarchyType?: HierarchyEnum;
}
export declare const hierarchyRisksConverter: (riskGroup: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData, hierarchyTree: IHierarchyMap, { hierarchyType }: IHierarchyRiskOptions) => {
    bodyData: bodyTableProps[][];
    headerData: headerTableProps[];
};
