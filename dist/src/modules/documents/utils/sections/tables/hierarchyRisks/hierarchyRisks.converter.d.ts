import { HierarchyEnum } from '@prisma/client';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
export interface IHierarchyRiskOptions {
    hierarchyType?: HierarchyEnum;
}
export declare const hierarchyRisksConverter: (riskGroup: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData, { hierarchyType }: IHierarchyRiskOptions) => {
    bodyData: bodyTableProps[][];
    headerData: headerTableProps[];
};
