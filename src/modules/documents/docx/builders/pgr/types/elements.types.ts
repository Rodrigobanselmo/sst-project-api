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

export type IParagraph = {
  type: PGRSectionChildrenTypeEnum.PARAGRAPH;
  text: string;
  size?: number;
};

export type IBreak = {
  type: PGRSectionChildrenTypeEnum.BREAK;
};

export type ITableVersionControl = {
  type: PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
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
  | IProfessional;
