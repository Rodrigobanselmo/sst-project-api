import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
export declare const thirdRiskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: HierarchyMapData, isByGroup: boolean) => (import("docx").Paragraph | Table)[];
