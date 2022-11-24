import { RiskFactorGroupDataEntity } from '../../../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData, IHierarchyMap } from '../../../../../converter/hierarchy.converter';
import { bodyTableProps } from '../../elements/body';
export declare const dataConverter: (riskGroup: RiskFactorGroupDataEntity, hierarchyData: HierarchyMapData, hierarchyTree: IHierarchyMap) => bodyTableProps[][];
