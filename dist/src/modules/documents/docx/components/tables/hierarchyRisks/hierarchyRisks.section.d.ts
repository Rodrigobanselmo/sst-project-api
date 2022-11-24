import { PageOrientation, Paragraph, Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { IHierarchyRiskOptions } from './hierarchyRisks.converter';
export declare const hierarchyRisksTableSections: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData, hierarchyTree: IHierarchyMap, options?: IHierarchyRiskOptions) => {
    children: Table[];
    properties: {
        page: {
            margin: {
                left: number;
                right: number;
                top: number;
                bottom: number;
            };
            size: {
                orientation: PageOrientation;
            };
        };
    };
}[];
export declare const hierarchyRisksTableAllSections: (riskFactorGroupData: RiskFactorGroupDataEntity, hierarchiesEntity: IHierarchyData, hierarchyTree: IHierarchyMap, convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => (Paragraph | Table)[];
