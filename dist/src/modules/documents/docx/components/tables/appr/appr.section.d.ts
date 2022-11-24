import { HierarchyEnum } from '@prisma/client';
import { ISectionOptions } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
export interface IAPPRTableOptions {
    isByGroup?: boolean;
    hierarchyType?: HierarchyEnum;
}
export declare const APPRTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData, homoGroupTree: IHomoGroupMap) => ISectionOptions[];
