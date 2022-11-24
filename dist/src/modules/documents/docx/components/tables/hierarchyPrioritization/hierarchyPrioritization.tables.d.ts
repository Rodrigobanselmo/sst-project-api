import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
export declare const hierarchyPrioritizationTables: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData, hierarchyTree: IHierarchyMap, options?: IHierarchyPrioritizationOptions) => Table[];
