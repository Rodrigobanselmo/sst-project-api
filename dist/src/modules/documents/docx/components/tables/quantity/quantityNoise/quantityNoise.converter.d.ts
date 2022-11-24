import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from './../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
export declare const quantityNoiseConverter: (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => bodyTableProps[][];
