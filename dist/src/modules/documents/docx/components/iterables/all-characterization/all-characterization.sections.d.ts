import { Paragraph, Table } from 'docx';
import { ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { EnvironmentEntity } from '../../../../../company/entities/environment.entity';
export declare const allCharacterizationSections: (environmentsData: EnvironmentEntity[], hierarchiesTreeOrg: IHierarchyData, homoGroupTree: IHomoGroupMap, type: "env" | "char", convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
    footerText: string;
    children: (Paragraph | Table)[];
}[];
