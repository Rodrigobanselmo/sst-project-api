import { Paragraph, Table } from 'docx';
import { ISectionChildrenType } from '../../../../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../../../../builders/pgr/types/section.types';
export declare const expositionDegreeTable: (convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => (Paragraph | Table)[];
