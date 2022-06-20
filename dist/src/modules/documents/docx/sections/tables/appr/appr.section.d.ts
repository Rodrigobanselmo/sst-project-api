import { HierarchyEnum } from '@prisma/client';
import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
export interface IAPPRTableOptions {
    isByGroup?: boolean;
    hierarchyType?: HierarchyEnum;
}
export declare const APPRTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData, homoGroupTree: IHomoGroupMap, options?: IAPPRTableOptions) => {
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
