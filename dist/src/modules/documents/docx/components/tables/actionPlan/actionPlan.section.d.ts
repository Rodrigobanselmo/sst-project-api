import { PageOrientation, Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../converter/hierarchy.converter';
export declare const actionPlanTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => {
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
