import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { MapData } from '../../converter/hierarchy.converter';
export declare const firstRiskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: MapData) => Table;
