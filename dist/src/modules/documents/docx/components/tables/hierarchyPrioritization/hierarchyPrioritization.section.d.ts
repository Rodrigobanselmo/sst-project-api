import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
export declare const hierarchyPrioritizationTableSections: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData, hierarchyTree: IHierarchyMap, options?: IHierarchyPrioritizationOptions) => {
    children: import("docx").Table[];
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
