import { PageOrientation, Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../converter/hierarchy.converter';
import { IHierarchyRiskOptions } from './hierarchyRisks.converter';
export declare const hierarchyRisksTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData, options?: IHierarchyRiskOptions) => {
    children: Table[];
    properties: {
        page: {
            margin: {
                left: number;
                right: number;
                top: number;
                bottom: number;
            };
            size: {
                orientation: PageOrientation;
            };
        };
    };
};
