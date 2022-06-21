import { ISectionChildrenType } from './elements.types';
export declare enum PGRSectionTypeEnum {
    CHAPTER = "CHAPTER",
    TOC = "TOC",
    COVER = "COVER",
    SECTION = "SECTION"
}
export declare type ICover = {
    type: PGRSectionTypeEnum.COVER;
    imgPath?: string;
    version?: string;
};
export declare type ITOC = {
    type: PGRSectionTypeEnum.TOC;
};
export declare type IChapter = {
    type: PGRSectionTypeEnum.CHAPTER;
    text?: string;
    version?: string;
};
export declare type ISection = {
    type: PGRSectionTypeEnum.SECTION;
    children: ISectionChildrenType[];
    logoPath?: string;
    version?: string;
    footerText?: string;
};
export declare type IAllSectionTypesPGR = IChapter | ISection | ICover | ITOC;
export declare type IDocumentPGRSectionGroup = {
    data: IAllSectionTypesPGR[];
    footer: boolean;
    header: boolean;
};
export declare type IDocVariables = {
    placeholder: string;
    value: string;
};
export declare type IDocumentPGRSectionGroups = {
    variables: IDocVariables[];
    sections: IDocumentPGRSectionGroup[];
};
