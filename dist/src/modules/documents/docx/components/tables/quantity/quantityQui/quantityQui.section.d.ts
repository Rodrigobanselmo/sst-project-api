import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
export declare const quantityQuiTableSection: (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => {
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
};
