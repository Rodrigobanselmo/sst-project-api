import { Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
export declare const quantityQuiTable: (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => Table;
