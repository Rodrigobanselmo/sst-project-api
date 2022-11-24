import { ISectionOptions } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyData, IHierarchyMap, IHomoGroupMap } from '../../../converter/hierarchy.converter';
export interface IAPPRTableOptions {
    isByGroup?: boolean;
}
export declare const APPRByGroupTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: IHierarchyData, hierarchyTree: IHierarchyMap, homoGroupTree: IHomoGroupMap, options?: IAPPRTableOptions) => ISectionOptions[];
