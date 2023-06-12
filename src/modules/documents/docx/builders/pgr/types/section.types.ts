import { ISectionPropertiesOptions } from 'docx';
import { ISectionChildrenType } from './elements.types';

export enum DocumentSectionTypeEnum {
  CHAPTER = 'CHAPTER',
  TOC = 'TOC',
  COVER = 'COVER',
  SECTION = 'SECTION',
  APR = 'APR',
  APR_GROUP = 'APR_GROUP',
  ACTION_PLAN = 'ACTION_PLAN',
  ITERABLE_ENVIRONMENTS = 'ITERABLE_ENVIRONMENTS',
  ITERABLE_CHARACTERIZATION = 'ITERABLE_CHARACTERIZATION',
}

interface IBase {
  removeWithSomeEmptyVars?: string[];
  removeWithAllEmptyVars?: string[];
  removeWithAllValidVars?: string[];
  addWithAllVars?: string[];
  id?: string;
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

export type IAprGroupTable = {
  type: DocumentSectionTypeEnum.APR_GROUP;
  properties?: ISectionPropertiesOptions;
} & IBase;

export type IActionPlanTable = {
  type: DocumentSectionTypeEnum.ACTION_PLAN;
  properties?: ISectionPropertiesOptions;
} & IBase;

export type IAllDocumentSectionType = IChapter | ISection | ICover | ISectionEnv | ISectionChar | ITOC | IAprTable | IAprGroupTable | IActionPlanTable;

export type IDocumentPGRSectionGroup = {
  data: IAllDocumentSectionType[];
};

export type IDocVariables = Record<string, string>;

export type IDocumentPGRSectionGroups = {
  variables: IDocVariables;
  sections: IDocumentPGRSectionGroup[];
};
