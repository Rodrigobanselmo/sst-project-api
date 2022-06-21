import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../checklist/entities/riskGroupData.entity';
import { MapData } from '../../../../../converter/hierarchy.converter';
export declare const firstRiskInventoryTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchyData: MapData, isByGroup: boolean) => Table;