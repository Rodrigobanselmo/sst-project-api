import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
export declare const quantityVLConverter: (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => bodyTableProps[][];
