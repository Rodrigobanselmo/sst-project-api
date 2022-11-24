import { RiskFactorGroupDataEntity } from '../../../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData, IHomoGroupMap } from '../../../../../converter/hierarchy.converter';
import { bodyTableProps } from '../../elements/body';
export declare const documentConverter: (riskFactorGroupData: RiskFactorGroupDataEntity, homoGroupTree: IHomoGroupMap, hierarchy: HierarchyMapData, isByGroup: boolean) => bodyTableProps[][];
