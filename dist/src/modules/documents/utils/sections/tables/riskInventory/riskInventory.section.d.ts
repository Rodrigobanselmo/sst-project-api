import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { HierarchyEntity } from 'src/modules/company/entities/hierarchy.entity';
export declare const riskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: HierarchyEntity[]) => {
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
