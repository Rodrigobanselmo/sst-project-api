import { ISectionOptions } from 'docx';
import { IAllSectionTypesPGR, IDocVariables } from '../types/section.types';
declare type IMapDocumentType = Record<string, (arg: IAllSectionTypesPGR, variables?: IDocVariables[]) => ISectionOptions | ISectionOptions[]>;
interface ISectionTypeMapProps {
    logoPath?: string;
    version?: string;
}
export declare const sectionTypeMap: ({ logoPath, version, }: ISectionTypeMapProps) => IMapDocumentType;
export {};
