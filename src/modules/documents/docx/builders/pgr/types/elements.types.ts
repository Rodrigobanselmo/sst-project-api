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
  BULLET_SPACE = 'BULLET_SPACE',
  TABLE_VERSION_CONTROL = 'TABLE_VERSION_CONTROL',
  ITERABLE_ENVIRONMENTS = 'ITERABLE_ENVIRONMENTS',
  HIERARCHY_RISK_TABLE = 'HIERARCHY_RISK_TABLE',
  RISK_TABLE = 'RISK_TABLE',
  PARAGRAPH_TABLE = 'PARAGRAPH_TABLE',
  LEGEND = 'LEGEND',
  MEASURE_IMAGE = 'MEASURE_IMAGE',
  RS_IMAGE = 'RS_IMAGE',
  PARAGRAPH_FIGURE = 'PARAGRAPH_FIGURE',
  PROFESSIONAL = 'PROFESSIONAL',
  COMPLEMENTARY_DOCS = 'COMPLEMENTARY_DOCS',
  COMPLEMENTARY_SYSTEMS = 'COMPLEMENTARY_SYSTEMS',
  HEALTH_EFFECT_TABLES = 'HEALTH_EFFECT_TABLES',
  EXPOSITION_DEGREE_TABLES = 'EXPOSITION_DEGREE_TABLES',
  HIERARCHY_ORG_TABLE = 'HIERARCHY_ORG_TABLE',
  QUANTITY_RESULTS_TABLES = 'QUANTITY_RESULTS_TABLES',
  MATRIX_TABLES = 'MATRIX_TABLES',
}

interface IBase {
  removeWithSomeEmptyVars?: string[];
  removeWithAllEmptyVars?: string[];
  removeWithAllValidVars?: string[];
  addWithAllVars?: string[];
}

export type IBullet = {
  type: PGRSectionChildrenTypeEnum.BULLET;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
} & IBase;

export type IBulletSpace = {
  type: PGRSectionChildrenTypeEnum.BULLET_SPACE;
  text: string;
} & IBase;

export type IH1 = {
  type: PGRSectionChildrenTypeEnum.H1;
  text: string;
} & IBase;

export type IH2 = {
  type: PGRSectionChildrenTypeEnum.H2;
  text: string;
} & IBase;

export type IH3 = {
  type: PGRSectionChildrenTypeEnum.H3;
  text: string;
} & IBase;

export type IH4 = {
  type: PGRSectionChildrenTypeEnum.H4;
  text: string;
} & IBase;

export type IH5 = {
  text: string;
  type: PGRSectionChildrenTypeEnum.H5;
} & IBase;

export type IH6 = {
  type: PGRSectionChildrenTypeEnum.H6;
  text: string;
} & IBase;

export type ITitle = {
  type: PGRSectionChildrenTypeEnum.TITLE;
  text: string;
} & IBase;

export type IParagraph = Omit<IParagraphOptions, 'text'> & {
  type: PGRSectionChildrenTypeEnum.PARAGRAPH;
  text: string;
  size?: number;
  align?: AlignmentType;
} & IBase;

export type ILegend = Omit<IParagraphOptions, 'text'> & {
  type: PGRSectionChildrenTypeEnum.LEGEND;
  text: string;
  size?: number;
  align?: AlignmentType;
} & IBase;

export type IParagraphTable = Omit<IParagraph, 'type'> & {
  type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE;
} & IBase;

export type IParagraphFigure = Omit<IParagraph, 'type'> & {
  type: PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE;
} & IBase;

export type IBreak = {
  type: PGRSectionChildrenTypeEnum.BREAK;
} & IBase;

export type ITableVersionControl = {
  type: PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
} & IBase;

export type IEnvironments = {
  type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS;
} & IBase;

export type IProfessional = {
  type: PGRSectionChildrenTypeEnum.PROFESSIONAL;
} & IBase;

export type IComplementaryDocs = {
  type: PGRSectionChildrenTypeEnum.COMPLEMENTARY_DOCS;
} & IBase;

export type IComplementarySystems = {
  type: PGRSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS;
} & IBase;

export type IHealthEffectTable = {
  type: PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES;
} & IBase;

export type IExpositionTable = {
  type: PGRSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES;
} & IBase;

export type IMatrix = {
  type: PGRSectionChildrenTypeEnum.MATRIX_TABLES;
} & IBase;

export type IQuantityTable = {
  type: PGRSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES;
} & IBase;

export type IMeasureImage = {
  type: PGRSectionChildrenTypeEnum.MEASURE_IMAGE;
} & IBase;

export type IRSImage = {
  type: PGRSectionChildrenTypeEnum.RS_IMAGE;
} & IBase;

export type IHierarchyTable = {
  type: PGRSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE;
} & IBase;

export type IHierarchyRiskTable = {
  type: PGRSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE;
} & IBase;

export type IRiskTable = {
  type: PGRSectionChildrenTypeEnum.RISK_TABLE;
} & IBase;

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
  | IBulletSpace
  | ITableVersionControl
  | IParagraphTable
  | ILegend
  | IParagraphFigure
  | IComplementarySystems
  | IHealthEffectTable
  | IExpositionTable
  | IHierarchyTable
  | IHierarchyRiskTable
  | IRiskTable
  | IMatrix
  | IQuantityTable
  | IComplementaryDocs
  | IEnvironments
  | IMeasureImage
  | IRSImage
  | IProfessional;
