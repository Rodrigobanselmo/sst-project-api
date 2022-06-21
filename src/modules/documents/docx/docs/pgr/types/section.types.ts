import { ISectionChildrenType } from './elements.types';

export enum PGRSectionTypeEnum {
  CHAPTER = 'CHAPTER',
  TOC = 'TOC',
  COVER = 'COVER',
  SECTION = 'SECTION',
}

export type ICover = {
  type: PGRSectionTypeEnum.COVER;
  imgPath?: string;
  version?: string;
};

export type ITOC = {
  type: PGRSectionTypeEnum.TOC;
};

export type IChapter = {
  type: PGRSectionTypeEnum.CHAPTER;
  text?: string;
  version?: string;
};
export type ISection = {
  type: PGRSectionTypeEnum.SECTION;
  children: ISectionChildrenType[];
  logoPath?: string;
  version?: string;
  footerText?: string;
};

export type IAllSectionTypesPGR = IChapter | ISection | ICover | ITOC;

export type IDocumentPGRSectionGroup = {
  data: IAllSectionTypesPGR[];
  footer: boolean;
  header: boolean;
};

export type IDocVariables = {
  placeholder: string;
  value: string;
};

export type IDocumentPGRSectionGroups = {
  variables: IDocVariables[];
  sections: IDocumentPGRSectionGroup[];
};
