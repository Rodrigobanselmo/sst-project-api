import { ISectionPropertiesOptions } from 'docx';
import { ISectionChildrenType } from './elements.types';

export enum DocumentSectionTypeEnum {
  CHAPTER = 'CHAPTER',
  TOC = 'TOC',
  COVER = 'COVER',
  SECTION = 'SECTION',
  APR = 'APR',
  ITERABLE_ENVIRONMENTS = 'ITERABLE_ENVIRONMENTS',
  ITERABLE_CHARACTERIZATION = 'ITERABLE_CHARACTERIZATION',
}

interface IBase {
  removeWithSomeEmptyVars?: string[];
  removeWithAllEmptyVars?: string[];
  removeWithAllValidVars?: string[];
  addWithAllVars?: string[];
  label?: string;
}

export type ICover = {
  type: DocumentSectionTypeEnum.COVER;
  imgPath?: string;
  version?: string;
} & IBase;

export type ITOC = {
  type: DocumentSectionTypeEnum.TOC;
} & IBase;

export type IChapter = {
  type: DocumentSectionTypeEnum.CHAPTER;
  text?: string;
  version?: string;
} & IBase;

export type ISection = {
  type: DocumentSectionTypeEnum.SECTION;
  children: ISectionChildrenType[];
  footerText?: string;
  properties?: ISectionPropertiesOptions;
} & IBase;

export type ISectionEnv = {
  type: DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS;
} & IBase;

export type ISectionChar = {
  type: DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION;
} & IBase;

export type IAprTable = {
  type: DocumentSectionTypeEnum.APR;
  properties?: ISectionPropertiesOptions;
} & IBase;

export type IAllSectionTypesPGR = IChapter | ISection | ICover | ISectionEnv | ISectionChar | ITOC | IAprTable;

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
