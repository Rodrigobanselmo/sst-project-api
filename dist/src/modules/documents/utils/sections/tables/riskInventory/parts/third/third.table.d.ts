import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../../modules/checklist/entities/riskGroupData.entity';
import { MapData } from '../../converter/hierarchy.converter';
export declare const thirdRiskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: MapData) => (Table | import("docx").Paragraph)[];
