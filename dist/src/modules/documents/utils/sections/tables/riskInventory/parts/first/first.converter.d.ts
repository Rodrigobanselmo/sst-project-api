import { RiskFactorGroupDataEntity } from '../../../../../../../../modules/checklist/entities/riskGroupData.entity';
import { MapData } from '../../converter/hierarchy.converter';
import { bodyTableProps } from '../../elements/body';
export declare const documentConverter: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchy: MapData) => bodyTableProps[][];
