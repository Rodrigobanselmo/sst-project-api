import { PageOrientation, Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../converter/hierarchy.converter';
export declare const hierarchyPrioritizationTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData) => {
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
