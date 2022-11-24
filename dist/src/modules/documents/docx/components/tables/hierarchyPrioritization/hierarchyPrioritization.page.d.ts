import { Paragraph, Table } from 'docx';
import { ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
export declare const hierarchyPrioritizationPage: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData, hierarchyTree: IHierarchyMap, options: IHierarchyPrioritizationOptions, convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => (Paragraph | Table)[];
