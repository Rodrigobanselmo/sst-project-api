import { ISectionPropertiesOptions } from 'docx';
import { ISectionChildrenType } from './elements.types';
export declare enum PGRSectionTypeEnum {
    CHAPTER = "CHAPTER",
    TOC = "TOC",
    COVER = "COVER",
    SECTION = "SECTION",
    APR = "APR",
    ITERABLE_ENVIRONMENTS = "ITERABLE_ENVIRONMENTS",
    ITERABLE_CHARACTERIZATION = "ITERABLE_CHARACTERIZATION"
}
interface IBase {
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
}
export declare type ICover = {
    type: PGRSectionTypeEnum.COVER;
    imgPath?: string;
    version?: string;
} & IBase;
export declare type ITOC = {
    type: PGRSectionTypeEnum.TOC;
} & IBase;
export declare type IChapter = {
    type: PGRSectionTypeEnum.CHAPTER;
    text?: string;
    version?: string;
} & IBase;
export declare type ISection = {
    type: PGRSectionTypeEnum.SECTION;
    children: ISectionChildrenType[];
    footerText?: string;
    properties?: ISectionPropertiesOptions;
} & IBase;
export declare type ISectionEnv = {
    type: PGRSectionTypeEnum.ITERABLE_ENVIRONMENTS;
} & IBase;
export declare type ISectionChar = {
    type: PGRSectionTypeEnum.ITERABLE_CHARACTERIZATION;
} & IBase;
export declare type IAprTable = {
    type: PGRSectionTypeEnum.APR;
    properties?: ISectionPropertiesOptions;
} & IBase;
export declare type IAllSectionTypesPGR = IChapter | ISection | ICover | ISectionEnv | ISectionChar | ITOC | IAprTable;
export declare type IDocumentPGRSectionGroup = {
    data: IAllSectionTypesPGR[];
    footer: boolean;
    header: boolean;
};
export declare type IDocVariables = Record<string, string>;
export declare type IDocumentPGRSectionGroups = {
    variables: IDocVariables;
    sections: IDocumentPGRSectionGroup[];
};
export {};
