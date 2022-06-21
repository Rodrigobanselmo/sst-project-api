import { ISectionChildrenType } from '../types/elements.types';
import { IDocVariables } from '../types/section.types';
export declare const convertToDocx: (data: ISectionChildrenType[], variables: IDocVariables[]) => (import("docx").Paragraph | import("docx").Table)[];
