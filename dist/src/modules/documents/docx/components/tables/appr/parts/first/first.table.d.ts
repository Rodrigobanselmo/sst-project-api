import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData, IHomoGroupMap } from '../../../../../converter/hierarchy.converter';
export declare const firstRiskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, homoGroupTree: IHomoGroupMap, hierarchyData: HierarchyMapData, isByGroup: boolean) => Table;
