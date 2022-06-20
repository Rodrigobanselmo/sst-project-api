import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../converter/hierarchy.converter';
export declare const riskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData) => {
    children: any[];
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
