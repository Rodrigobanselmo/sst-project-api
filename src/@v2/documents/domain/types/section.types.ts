import { ISectionPropertiesOptions } from 'docx';
import { ISectionChildrenType } from './elements.types';
import { DocumentSectionTypeEnum } from '../enums/document-section-type.enum';

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
  title?: string;
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

export type IPericulosidadeActivities = {
  type: DocumentSectionTypeEnum.PERICULOSIDADE_ACTIVITIES;
} & IBase;

export type IAllDocumentSectionType = IChapter | ISection | ICover | ISectionEnv | ISectionChar | ITOC | IAprTable | IAprGroupTable | IActionPlanTable | IPericulosidadeActivities;
