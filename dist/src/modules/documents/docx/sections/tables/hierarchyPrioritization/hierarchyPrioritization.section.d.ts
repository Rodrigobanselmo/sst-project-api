import { PageOrientation, Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../../converter/hierarchy.converter';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
export declare const hierarchyPrioritizationTableSections: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData, options?: IHierarchyPrioritizationOptions) => {
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
}[];
