import { AlignmentType, IParagraphOptions } from 'docx';

export enum DocumentSectionChildrenTypeEnum {
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
  ATTACHMENTS = 'ATTACHMENTS',
  PARAGRAPH_TABLE = 'PARAGRAPH_TABLE',
  LEGEND = 'LEGEND',
  PROFESSIONAL = 'PROFESSIONAL',
  PROFESSIONALS_SIGNATURES = 'PROFESSIONALS_SIGNATURES',
  PARAGRAPH_FIGURE = 'PARAGRAPH_FIGURE',

  ITERABLE_ENVIRONMENTS_ADM = 'ITERABLE_ENVIRONMENTS',
  ITERABLE_ENVIRONMENTS_OP = 'ITERABLE_ENVIRONMENTS_OP',
  ITERABLE_ENVIRONMENTS_SUP = 'ITERABLE_ENVIRONMENTS_SUP',
  ITERABLE_ENVIRONMENTS_GENERAL = 'ITERABLE_ENVIRONMENTS_GENERAL',
  ITERABLE_CHARACTERIZATION_EQUIP = 'ITERABLE_CHARACTERIZATION_EQUIP',
  ITERABLE_CHARACTERIZATION_ACTIVIT = 'ITERABLE_CHARACTERIZATION_ACTIVIT',
  ITERABLE_CHARACTERIZATION_WORKSTATION = 'ITERABLE_CHARACTERIZATION_WORKSTATION',
  ITERABLE_RECOMMENDATIONS = 'ITERABLE_RECOMMENDATIONS',
  ITERABLE_EMERGENCY_RISKS = 'ITERABLE_EMERGENCY_RISKS',
  TABLE_GSE = 'TABLE_GSE',
  TABLE_HIERARCHY_ENV = 'TABLE_HIERARCHY_ENV',
  TABLE_HIERARCHY_CHAR = 'TABLE_HIERARCHY_CHAR',
  TABLE_PRIORITIZATION = 'TABLE_PRIORITIZATION',
  TABLE_PRIORITIZATION_ENV = 'TABLE_PRIORITIZATION_ENV',
  TABLE_PRIORITIZATION_CHAR = 'TABLE_PRIORITIZATION_CHAR',
  TABLE_PRIORITIZATION_HIERARCHY = 'TABLE_PRIORITIZATION_HIERARCHY',

  ITERABLE_QUALITY_FIS = 'ITERABLE_QUALITY_FIS',
  ITERABLE_QUALITY_QUI = 'ITERABLE_QUALITY_QUI',
  ITERABLE_QUALITY_BIO = 'ITERABLE_QUALITY_BIO',
  ITERABLE_QUALITY_ERG = 'ITERABLE_QUALITY_ERG',
  ITERABLE_QUALITY_ACI = 'ITERABLE_QUALITY_ACI',

  TABLE_QUANTITY_NOISE = 'TABLE_QUANTITY_NOISE',
  TABLE_QUANTITY_QUI = 'TABLE_QUANTITY_QUI',
  TABLE_QUANTITY_HEAT = 'TABLE_QUANTITY_HEAT',
  TABLE_QUANTITY_VFB = 'TABLE_QUANTITY_VFB',
  TABLE_QUANTITY_VL = 'TABLE_QUANTITY_VL',
  TABLE_QUANTITY_RAD = 'TABLE_QUANTITY_RAD',

  HIERARCHY_RISK_TABLE = 'HIERARCHY_RISK_TABLE',
  RISK_TABLE = 'RISK_TABLE',
  MEASURE_IMAGE = 'MEASURE_IMAGE',
  RS_IMAGE = 'RS_IMAGE',
  COMPLEMENTARY_DOCS = 'COMPLEMENTARY_DOCS',
  COMPLEMENTARY_SYSTEMS = 'COMPLEMENTARY_SYSTEMS',
  HEALTH_EFFECT_TABLES = 'HEALTH_EFFECT_TABLES',
  EXPOSITION_DEGREE_TABLES = 'EXPOSITION_DEGREE_TABLES',
  HIERARCHY_ORG_TABLE = 'HIERARCHY_ORG_TABLE',
  QUANTITY_RESULTS_TABLES = 'QUANTITY_RESULTS_TABLES',
  QUANTITY_CONSIDERATION_TABLES = 'QUANTITY_CONSIDERATION_TABLES',
  MATRIX_TABLES = 'MATRIX_TABLES',
  APR_TABLE = 'APR_TABLE',
  PLAN_TABLE = 'PLAN_TABLE',
}

interface IBase {
  removeWithSomeEmptyVars?: string[];
  removeWithAllEmptyVars?: string[];
  removeWithAllValidVars?: string[];
  addWithAllVars?: string[];
}

export const optionsBulletLevel: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> = [0, 1, 2, 3, 4, 5, 6];
type OptionsLevel = typeof optionsBulletLevel[number];

export type IBullet = Omit<IParagraphOptions, 'text'> & {
  type: DocumentSectionChildrenTypeEnum.BULLET;
  text: string;
  level?: OptionsLevel;
  size?: number;
} & IBase;

export type IParagraph = Omit<IParagraphOptions, 'text'> & {
  type: DocumentSectionChildrenTypeEnum.PARAGRAPH;
  text: string;
  size?: number;
  color?: string;
  align?: AlignmentType;
} & IBase;

export type ILegend = Omit<IParagraphOptions, 'text'> & {
  type: DocumentSectionChildrenTypeEnum.LEGEND;
  text: string;
  color?: string;
  size?: number;
  align?: AlignmentType;
} & IBase;

export type IBulletSpace = {
  type: DocumentSectionChildrenTypeEnum.BULLET_SPACE;
  text: string;
} & IBase;

export type IH1 = {
  type: DocumentSectionChildrenTypeEnum.H1;
  text: string;
} & IBase;

export type IH2 = {
  type: DocumentSectionChildrenTypeEnum.H2;
  text: string;
} & IBase;

export type IH3 = {
  type: DocumentSectionChildrenTypeEnum.H3;
  text: string;
} & IBase;

export type IH4 = {
  type: DocumentSectionChildrenTypeEnum.H4;
  text: string;
} & IBase;

export type IH5 = {
  text: string;
  type: DocumentSectionChildrenTypeEnum.H5;
} & IBase;

export type IH6 = {
  type: DocumentSectionChildrenTypeEnum.H6;
  text: string;
} & IBase;

export type ITitle = {
  type: DocumentSectionChildrenTypeEnum.TITLE;
  text: string;
} & IBase;

export type IParagraphTable = Omit<IParagraph, 'type'> & {
  type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE;
} & IBase;

export type IParagraphFigure = Omit<IParagraph, 'type'> & {
  type: DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE;
} & IBase;

export type IBreak = {
  type: DocumentSectionChildrenTypeEnum.BREAK;
} & IBase;

export type ITableVersionControl = {
  type: DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
} & IBase;

export type IEnvironmentsAdm = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM;
} & IBase;

export type IEnvironmentsGeneral = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL;
} & IBase;

export type IEnvironmentsOp = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP;
} & IBase;

export type IEnvironmentsSup = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP;
} & IBase;

export type ICharacterizationEquip = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP;
} & IBase;

export type ICharacterizationActivity = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT;
} & IBase;

export type ICharacterizationWork = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION;
} & IBase;

export type IProfessional = {
  type: DocumentSectionChildrenTypeEnum.PROFESSIONAL;
} & IBase;

export type IProfessionalSignature = {
  type: DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES;
} & IBase;

export type IComplementaryDocs = {
  type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS;
} & IBase;

export type IComplementarySystems = {
  type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS;
} & IBase;

export type IHealthEffectTable = {
  type: DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES;
} & IBase;

export type IExpositionTable = {
  type: DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES;
} & IBase;

export type IGseTable = {
  type: DocumentSectionChildrenTypeEnum.TABLE_GSE;
} & IBase;

export type IGseEnvTable = {
  type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV;
} & IBase;

export type IGseCharTable = {
  type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR;
} & IBase;

export type IMatrix = {
  type: DocumentSectionChildrenTypeEnum.MATRIX_TABLES;
} & IBase;

export type IQuantityTable = {
  type: DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES;
} & IBase;

export type IConsiderationsQuantityTable = {
  type: DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES;
} & IBase;

export type IMeasureImage = {
  type: DocumentSectionChildrenTypeEnum.MEASURE_IMAGE;
} & IBase;

export type IRSImage = {
  type: DocumentSectionChildrenTypeEnum.RS_IMAGE;
} & IBase;

export type IHierarchyTable = {
  type: DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE;
} & IBase;

export type IHierarchyRiskTable = {
  type: DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE;
} & IBase;

export type IRiskTable = {
  type: DocumentSectionChildrenTypeEnum.RISK_TABLE;
} & IBase;

export type IPrioritization = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION;
} & IBase;

export type IPrioritizationH = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY;
} & IBase;

export type IPrioritizationE = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV;
} & IBase;

export type IPrioritizationC = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR;
} & IBase;

export type IQuantityNoise = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE;
} & IBase;

export type IQuantityQui = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI;
} & IBase;

export type IQuantityHeat = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT;
} & IBase;

export type IQuantityVFB = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB;
} & IBase;

export type IQuantityVL = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL;
} & IBase;

export type IQuantityRad = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD;
} & IBase;

export type IRecommendations = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS;
} & IBase;

export type IEmergency = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS;
} & IBase;

export type IApr = {
  type: DocumentSectionChildrenTypeEnum.APR_TABLE;
} & IBase;

export type IPlan = {
  type: DocumentSectionChildrenTypeEnum.PLAN_TABLE;
} & IBase;

export type IAttachments = {
  type: DocumentSectionChildrenTypeEnum.ATTACHMENTS;
} & IBase;

export type IIterableFis = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS;
} & IBase;

export type IIterableQui = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI;
} & IBase;

export type IIterableBio = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO;
} & IBase;

export type IIterableErg = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG;
} & IBase;

export type IIterableArc = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI;
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
  | IQuantityNoise
  | IQuantityQui
  | IQuantityHeat
  | IQuantityVFB
  | IQuantityVL
  | IQuantityRad
  | IQuantityTable
  | IComplementaryDocs
  | IEnvironmentsAdm
  | IEnvironmentsSup
  | IEnvironmentsOp
  | IEnvironmentsGeneral
  | ICharacterizationEquip
  | ICharacterizationActivity
  | ICharacterizationWork
  | IMeasureImage
  | IRSImage
  | IGseTable
  | IPrioritization
  | IPrioritizationH
  | IPrioritizationE
  | IPrioritizationC
  | IRecommendations
  | IGseCharTable
  | IGseEnvTable
  | IEmergency
  | IApr
  | IPlan
  | IIterableFis
  | IIterableQui
  | IIterableBio
  | IIterableErg
  | IIterableArc
  | IAttachments
  | IProfessionalSignature
  | IConsiderationsQuantityTable
  | IProfessional;
