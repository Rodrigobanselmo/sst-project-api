import { Paragraph, Table } from 'docx';
import { ISectionChildrenType } from '../types/elements.types';
import { IDocVariables } from '../types/section.types';
declare type IMapDocumentType = Record<string, (arg: ISectionChildrenType, variables?: IDocVariables[]) => Paragraph | Table>;
export declare const elementTypeMap: IMapDocumentType;
export {};
