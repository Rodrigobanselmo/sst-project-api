import { ISectionPropertiesOptions } from 'docx';
import { ISectionChildrenType } from './elements.types';

export enum PGRSectionTypeEnum {
  CHAPTER = 'CHAPTER',
  TOC = 'TOC',
  COVER = 'COVER',
  SECTION = 'SECTION',
}

interface IBase {
  removeWithSomeEmptyVars?: string[];
  removeWithAllEmptyVars?: string[];
  removeWithAllValidVars?: string[];
  addWithAllVars?: string[];
}

export type ICover = {
  type: PGRSectionTypeEnum.COVER;
  imgPath?: string;
  version?: string;
} & IBase;

export type ITOC = {
  type: PGRSectionTypeEnum.TOC;
} & IBase;

export type IChapter = {
  type: PGRSectionTypeEnum.CHAPTER;
  text?: string;
  version?: string;
} & IBase;

export type ISection = {
  type: PGRSectionTypeEnum.SECTION;
  children: ISectionChildrenType[];
  footerText?: string;
  properties?: ISectionPropertiesOptions;
} & IBase;

export type IAllSectionTypesPGR = IChapter | ISection | ICover | ITOC;

export type IDocumentPGRSectionGroup = {
  data: IAllSectionTypesPGR[];
  footer: boolean;
  header: boolean;
};

export type IDocVariables = Record<string, string>;

export type IDocumentPGRSectionGroups = {
  variables: IDocVariables;
  sections: IDocumentPGRSectionGroup[];
};
