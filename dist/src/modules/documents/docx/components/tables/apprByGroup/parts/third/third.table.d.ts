import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData, IHierarchyMap } from '../../../../../converter/hierarchy.converter';
export declare const thirdRiskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: HierarchyMapData, hierarchyTree: IHierarchyMap) => (import("docx").Paragraph | Table)[];
