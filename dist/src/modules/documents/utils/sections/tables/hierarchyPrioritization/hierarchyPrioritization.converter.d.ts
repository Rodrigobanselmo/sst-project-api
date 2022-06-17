import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
export declare const hierarchyPrioritizationConverter: (riskGroup: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData) => {
    bodyData: bodyTableProps[][];
    headerData: headerTableProps[];
};
