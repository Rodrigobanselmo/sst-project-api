import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../checklist/entities/riskGroupData.entity';
import { MapData } from '../../../../../converter/hierarchy.converter';
export declare const thirdRiskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: MapData) => (import("docx").Paragraph | Table)[];