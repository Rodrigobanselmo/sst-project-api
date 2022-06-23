import { AlignmentType, IParagraphOptions } from 'docx';

export enum PGRSectionChildrenTypeEnum {
  TITLE = 'TITLE',
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  H4 = 'H4',
  H5 = 'H5',
  H6 = 'H6',
  PARAGRAPH = 'PARAGRAPH',
  BREAK = 'BREAK',
  BULLET = 'BULLET',
  TABLE_VERSION_CONTROL = 'TABLE_VERSION_CONTROL',
  ITERABLE_ENVIRONMENTS = 'ITERABLE_ENVIRONMENTS',
  PARAGRAPH_TABLE = 'PARAGRAPH_TABLE',
  PARAGRAPH_FIGURE = 'PARAGRAPH_FIGURE',
  PROFESSIONAL = 'PROFESSIONAL',
}

export type IBullet = {
  type: PGRSectionChildrenTypeEnum.BULLET;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
};

export type IH1 = {
  type: PGRSectionChildrenTypeEnum.H1;
  text: string;
};

export type IH2 = {
  type: PGRSectionChildrenTypeEnum.H2;
  text: string;
};

export type IH3 = {
  type: PGRSectionChildrenTypeEnum.H3;
  text: string;
};

export type IH4 = {
  type: PGRSectionChildrenTypeEnum.H4;
  text: string;
};

export type IH5 = {
  text: string;
  type: PGRSectionChildrenTypeEnum.H5;
};

export type IH6 = {
  type: PGRSectionChildrenTypeEnum.H6;
  text: string;
};

export type ITitle = {
  type: PGRSectionChildrenTypeEnum.TITLE;
  text: string;
};

export type IParagraph = Omit<IParagraphOptions, 'text'> & {
  type: PGRSectionChildrenTypeEnum.PARAGRAPH;
  text: string;
  size?: number;
  align?: AlignmentType;
};

export type IParagraphTable = Omit<IParagraph, 'type'> & {
  type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE;
};

export type IParagraphFigure = Omit<IParagraph, 'type'> & {
  type: PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE;
};

export type IBreak = {
  type: PGRSectionChildrenTypeEnum.BREAK;
};

export type ITableVersionControl = {
  type: PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
};

export type IEnvironments = {
  type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS;
};

export type IProfessional = {
  type: PGRSectionChildrenTypeEnum.PROFESSIONAL;
};

export type ISectionChildrenType =
  | IH1
  | IH2
  | IH3
  | IH4
  | IH5
  | IH6
  | IParagraph
  | IBreak
  | ITitle
  | IBullet
  | ITableVersionControl
  | IParagraphTable
  | IParagraphFigure
  | IEnvironments
  | IProfessional;
