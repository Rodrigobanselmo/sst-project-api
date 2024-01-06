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
  IMAGE = 'IMAGE',
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

  TABLE_PCMSO_GHO = 'TABLE_PCMSO_GHO',
  TABLE_PCMSO_HIERARCHY = 'TABLE_PCMSO_HIERARCHY',

}

export enum InlineStyleTypeEnum {
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  UNDERLINE = 'UNDERLINE',
  SUPERSCRIPT = 'SUPERSCRIPT',
  SUBSCRIPT = 'SUBSCRIPT',
  COLOR = 'COLOR',
  BG_COLOR = 'BG_COLOR',
  FONTSIZE = 'FONTSIZE',
}

export interface IBaseDocumentModel {
  removeWithSomeEmptyVars?: string[];
  removeWithAllEmptyVars?: string[];
  removeWithAllValidVars?: string[];
  addWithAllVars?: string[];
}

export interface IInlineStyleRange {
  offset: number;
  length: number;
  style: InlineStyleTypeEnum;
  value?: string;
}
export interface IEntityRange {
  offset: number;
  length: number;
  data?: {
    type: string;
    mutability: string;
    data: {
      url: string;
      targetOption: string;
    };
  };
}

export const optionsBulletLevel: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> = [0, 1, 2, 3, 4, 5, 6];
type OptionsLevel = typeof optionsBulletLevel[number];

export type IBullet = Omit<IParagraphOptions, 'text'> & {
  type: DocumentSectionChildrenTypeEnum.BULLET;
  text: string;
  level?: OptionsLevel;
  size?: number;
} & IBaseDocumentModel;

export type IParagraph = Omit<IParagraphOptions, 'text'> & {
  type: DocumentSectionChildrenTypeEnum.PARAGRAPH;
  text: string;
  size?: number;
  color?: string;
  align?: AlignmentType;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IImage = {
  type: DocumentSectionChildrenTypeEnum.IMAGE;
  url: string | null;
  width: number;
  align?: AlignmentType;
} & IBaseDocumentModel;

export type ILegend = Omit<IParagraphOptions, 'text'> & {
  type: DocumentSectionChildrenTypeEnum.LEGEND;
  text: string;
  color?: string;
  size?: number;
  align?: AlignmentType;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IBulletSpace = {
  type: DocumentSectionChildrenTypeEnum.BULLET_SPACE;
  text: string;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IH1 = {
  type: DocumentSectionChildrenTypeEnum.H1;
  text: string;
} & IBaseDocumentModel;

export type IH2 = {
  type: DocumentSectionChildrenTypeEnum.H2;
  text: string;
} & IBaseDocumentModel;

export type IH3 = {
  type: DocumentSectionChildrenTypeEnum.H3;
  text: string;
} & IBaseDocumentModel;

export type IH4 = {
  type: DocumentSectionChildrenTypeEnum.H4;
  text: string;
} & IBaseDocumentModel;

export type IH5 = {
  text: string;
  type: DocumentSectionChildrenTypeEnum.H5;
} & IBaseDocumentModel;

export type IH6 = {
  type: DocumentSectionChildrenTypeEnum.H6;
  text: string;
} & IBaseDocumentModel;

export type ITitle = {
  type: DocumentSectionChildrenTypeEnum.TITLE;
  text: string;
} & IBaseDocumentModel;

export type IParagraphTable = Omit<IParagraph, 'type'> & {
  type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IParagraphFigure = Omit<IParagraph, 'type'> & {
  type: DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IBreak = {
  type: DocumentSectionChildrenTypeEnum.BREAK;
} & IBaseDocumentModel;

export type ITableVersionControl = {
  type: DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
} & IBaseDocumentModel;

export type IEnvironmentsAdm = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM;
} & IBaseDocumentModel;

export type IEnvironmentsGeneral = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL;
} & IBaseDocumentModel;

export type IEnvironmentsOp = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP;
} & IBaseDocumentModel;

export type IEnvironmentsSup = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP;
} & IBaseDocumentModel;

export type ICharacterizationEquip = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP;
} & IBaseDocumentModel;

export type ICharacterizationActivity = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT;
} & IBaseDocumentModel;

export type ICharacterizationWork = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION;
} & IBaseDocumentModel;

export type IProfessional = {
  type: DocumentSectionChildrenTypeEnum.PROFESSIONAL;
} & IBaseDocumentModel;

export type IProfessionalSignature = {
  type: DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES;
} & IBaseDocumentModel;

export type IComplementaryDocs = {
  type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS;
} & IBaseDocumentModel;

export type IComplementarySystems = {
  type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS;
} & IBaseDocumentModel;

export type IHealthEffectTable = {
  type: DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES;
} & IBaseDocumentModel;

export type IExpositionTable = {
  type: DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES;
} & IBaseDocumentModel;

export type IGseTable = {
  type: DocumentSectionChildrenTypeEnum.TABLE_GSE;
} & IBaseDocumentModel;

export type IGseEnvTable = {
  type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV;
} & IBaseDocumentModel;

export type IGseCharTable = {
  type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR;
} & IBaseDocumentModel;

export type IMatrix = {
  type: DocumentSectionChildrenTypeEnum.MATRIX_TABLES;
} & IBaseDocumentModel;

export type IQuantityTable = {
  type: DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES;
} & IBaseDocumentModel;

export type IConsiderationsQuantityTable = {
  type: DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES;
} & IBaseDocumentModel;

export type IMeasureImage = {
  type: DocumentSectionChildrenTypeEnum.MEASURE_IMAGE;
} & IBaseDocumentModel;

export type IRSImage = {
  type: DocumentSectionChildrenTypeEnum.RS_IMAGE;
} & IBaseDocumentModel;

export type IHierarchyTable = {
  type: DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE;
} & IBaseDocumentModel;

export type IHierarchyRiskTable = {
  type: DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE;
} & IBaseDocumentModel;

export type IRiskTable = {
  type: DocumentSectionChildrenTypeEnum.RISK_TABLE;
} & IBaseDocumentModel;

export type IPrioritization = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION;
} & IBaseDocumentModel;

export type IPrioritizationH = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY;
} & IBaseDocumentModel;

export type IPrioritizationE = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV;
} & IBaseDocumentModel;

export type IPrioritizationC = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR;
} & IBaseDocumentModel;

export type IQuantityNoise = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE;
} & IBaseDocumentModel;

export type IQuantityQui = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI;
} & IBaseDocumentModel;

export type IQuantityHeat = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT;
} & IBaseDocumentModel;

export type IQuantityVFB = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB;
} & IBaseDocumentModel;

export type IQuantityVL = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL;
} & IBaseDocumentModel;

export type IQuantityRad = {
  type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD;
} & IBaseDocumentModel;

export type IRecommendations = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS;
} & IBaseDocumentModel;

export type IEmergency = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS;
} & IBaseDocumentModel;

export type IApr = {
  type: DocumentSectionChildrenTypeEnum.APR_TABLE;
} & IBaseDocumentModel;

export type IPlan = {
  type: DocumentSectionChildrenTypeEnum.PLAN_TABLE;
} & IBaseDocumentModel;

export type IAttachments = {
  type: DocumentSectionChildrenTypeEnum.ATTACHMENTS;
} & IBaseDocumentModel;

export type IIterableFis = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS;
} & IBaseDocumentModel;

export type IIterableQui = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI;
} & IBaseDocumentModel;

export type IIterableBio = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO;
} & IBaseDocumentModel;

export type IIterableErg = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG;
} & IBaseDocumentModel;

export type IIterableArc = {
  type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI;
} & IBaseDocumentModel;

export type ITablePcmsoGho = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PCMSO_GHO;
} & IBaseDocumentModel;

export type ITablePcmsoHierarchy = {
  type: DocumentSectionChildrenTypeEnum.TABLE_PCMSO_HIERARCHY;
} & IBaseDocumentModel;

export type ISectionChildrenType =
  | IH1
  | IH2
  | IH3
  | IH4
  | IH5
  | IH6
  | IParagraph
  | IImage
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
  | ITablePcmsoGho
  | ITablePcmsoHierarchy
  | IProfessional;
