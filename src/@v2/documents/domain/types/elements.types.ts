import { AlignmentType, IParagraphOptions } from 'docx';
import { DocumentChildrenTypeEnum } from '../enums/document-children-type.enum';
import { InlineStyleTypeEnum } from '../enums/inline-style-type.enum';

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
type OptionsLevel = (typeof optionsBulletLevel)[number];

export type IBullet = Omit<IParagraphOptions, 'text'> & {
  type: DocumentChildrenTypeEnum.BULLET;
  text: string;
  level?: OptionsLevel;
  size?: number;
} & IBaseDocumentModel;

export type IParagraph = Omit<IParagraphOptions, 'text'> & {
  type: DocumentChildrenTypeEnum.PARAGRAPH;
  text: string;
  size?: number;
  color?: string;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IImage = {
  type: DocumentChildrenTypeEnum.IMAGE;
  url: string | null;
  width: number;
  path?: string | null;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
} & IBaseDocumentModel;

export type ILegend = Omit<IParagraphOptions, 'text'> & {
  type: DocumentChildrenTypeEnum.LEGEND;
  text: string;
  color?: string;
  size?: number;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IBulletSpace = {
  type: DocumentChildrenTypeEnum.BULLET_SPACE;
  text: string;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IH1 = {
  type: DocumentChildrenTypeEnum.H1;
  text: string;
} & IBaseDocumentModel;

export type IH2 = {
  type: DocumentChildrenTypeEnum.H2;
  text: string;
} & IBaseDocumentModel;

export type IH3 = {
  type: DocumentChildrenTypeEnum.H3;
  text: string;
} & IBaseDocumentModel;

export type IH4 = {
  type: DocumentChildrenTypeEnum.H4;
  text: string;
} & IBaseDocumentModel;

export type IH5 = {
  text: string;
  type: DocumentChildrenTypeEnum.H5;
} & IBaseDocumentModel;

export type IH6 = {
  type: DocumentChildrenTypeEnum.H6;
  text: string;
} & IBaseDocumentModel;

export type ITitle = {
  type: DocumentChildrenTypeEnum.TITLE;
  text: string;
} & IBaseDocumentModel;

export type IParagraphTable = Omit<IParagraph, 'type'> & {
  type: DocumentChildrenTypeEnum.PARAGRAPH_TABLE;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IParagraphFigure = Omit<IParagraph, 'type'> & {
  type: DocumentChildrenTypeEnum.PARAGRAPH_FIGURE;
  inlineStyleRangeBlock?: IInlineStyleRange[][];
  entityRangeBlock?: IEntityRange[][];
} & IBaseDocumentModel;

export type IBreak = {
  type: DocumentChildrenTypeEnum.BREAK;
} & IBaseDocumentModel;

export type ITableVersionControl = {
  type: DocumentChildrenTypeEnum.TABLE_VERSION_CONTROL;
} & IBaseDocumentModel;

export type IEnvironmentsAdm = {
  type: DocumentChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM;
} & IBaseDocumentModel;

export type IEnvironmentsGeneral = {
  type: DocumentChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL;
} & IBaseDocumentModel;

export type IEnvironmentsOp = {
  type: DocumentChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP;
} & IBaseDocumentModel;

export type IEnvironmentsSup = {
  type: DocumentChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP;
} & IBaseDocumentModel;

export type ICharacterizationEquip = {
  type: DocumentChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP;
} & IBaseDocumentModel;

export type ICharacterizationActivity = {
  type: DocumentChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT;
} & IBaseDocumentModel;

export type ICharacterizationWork = {
  type: DocumentChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION;
} & IBaseDocumentModel;

export type IProfessional = {
  type: DocumentChildrenTypeEnum.PROFESSIONAL;
} & IBaseDocumentModel;

export type IProfessionalSignature = {
  type: DocumentChildrenTypeEnum.PROFESSIONALS_SIGNATURES;
} & IBaseDocumentModel;

export type IComplementaryDocs = {
  type: DocumentChildrenTypeEnum.COMPLEMENTARY_DOCS;
} & IBaseDocumentModel;

export type IComplementarySystems = {
  type: DocumentChildrenTypeEnum.COMPLEMENTARY_SYSTEMS;
} & IBaseDocumentModel;

export type IHealthEffectTable = {
  type: DocumentChildrenTypeEnum.HEALTH_EFFECT_TABLES;
} & IBaseDocumentModel;

export type IExpositionTable = {
  type: DocumentChildrenTypeEnum.EXPOSITION_DEGREE_TABLES;
} & IBaseDocumentModel;

export type IGseTable = {
  type: DocumentChildrenTypeEnum.TABLE_GSE;
} & IBaseDocumentModel;

export type IGseEnvTable = {
  type: DocumentChildrenTypeEnum.TABLE_HIERARCHY_ENV;
} & IBaseDocumentModel;

export type IGseCharTable = {
  type: DocumentChildrenTypeEnum.TABLE_HIERARCHY_CHAR;
} & IBaseDocumentModel;

export type IMatrix = {
  type: DocumentChildrenTypeEnum.MATRIX_TABLES;
} & IBaseDocumentModel;

export type IQuantityTable = {
  type: DocumentChildrenTypeEnum.QUANTITY_RESULTS_TABLES;
} & IBaseDocumentModel;

export type IConsiderationsQuantityTable = {
  type: DocumentChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES;
} & IBaseDocumentModel;

export type IMeasureImage = {
  type: DocumentChildrenTypeEnum.MEASURE_IMAGE;
} & IBaseDocumentModel;

export type IRSImage = {
  type: DocumentChildrenTypeEnum.RS_IMAGE;
} & IBaseDocumentModel;

export type IHierarchyTable = {
  type: DocumentChildrenTypeEnum.HIERARCHY_ORG_TABLE;
} & IBaseDocumentModel;

export type IHierarchyRiskTable = {
  type: DocumentChildrenTypeEnum.HIERARCHY_RISK_TABLE;
} & IBaseDocumentModel;

export type IRiskTable = {
  type: DocumentChildrenTypeEnum.RISK_TABLE;
} & IBaseDocumentModel;

export type IPrioritization = {
  type: DocumentChildrenTypeEnum.TABLE_PRIORITIZATION;
} & IBaseDocumentModel;

export type IPrioritizationH = {
  type: DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY;
} & IBaseDocumentModel;

export type IPrioritizationE = {
  type: DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_ENV;
} & IBaseDocumentModel;

export type IPrioritizationC = {
  type: DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR;
} & IBaseDocumentModel;

export type IQuantityNoise = {
  type: DocumentChildrenTypeEnum.TABLE_QUANTITY_NOISE;
} & IBaseDocumentModel;

export type IQuantityQui = {
  type: DocumentChildrenTypeEnum.TABLE_QUANTITY_QUI;
} & IBaseDocumentModel;

export type IQuantityHeat = {
  type: DocumentChildrenTypeEnum.TABLE_QUANTITY_HEAT;
} & IBaseDocumentModel;

export type IQuantityVFB = {
  type: DocumentChildrenTypeEnum.TABLE_QUANTITY_VFB;
} & IBaseDocumentModel;

export type IQuantityVL = {
  type: DocumentChildrenTypeEnum.TABLE_QUANTITY_VL;
} & IBaseDocumentModel;

export type IQuantityRad = {
  type: DocumentChildrenTypeEnum.TABLE_QUANTITY_RAD;
} & IBaseDocumentModel;

export type IRecommendations = {
  type: DocumentChildrenTypeEnum.ITERABLE_RECOMMENDATIONS;
} & IBaseDocumentModel;

export type IEmergency = {
  type: DocumentChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS;
} & IBaseDocumentModel;

export type IApr = {
  type: DocumentChildrenTypeEnum.APR_TABLE;
} & IBaseDocumentModel;

export type IPlan = {
  type: DocumentChildrenTypeEnum.PLAN_TABLE;
} & IBaseDocumentModel;

export type IAttachments = {
  type: DocumentChildrenTypeEnum.ATTACHMENTS;
} & IBaseDocumentModel;

export type IIterableFis = {
  type: DocumentChildrenTypeEnum.ITERABLE_QUALITY_FIS;
} & IBaseDocumentModel;

export type IIterableQui = {
  type: DocumentChildrenTypeEnum.ITERABLE_QUALITY_QUI;
} & IBaseDocumentModel;

export type IIterableBio = {
  type: DocumentChildrenTypeEnum.ITERABLE_QUALITY_BIO;
} & IBaseDocumentModel;

export type IIterableErg = {
  type: DocumentChildrenTypeEnum.ITERABLE_QUALITY_ERG;
} & IBaseDocumentModel;

export type IIterableArc = {
  type: DocumentChildrenTypeEnum.ITERABLE_QUALITY_ACI;
} & IBaseDocumentModel;

export type ITablePcmsoGho = {
  type: DocumentChildrenTypeEnum.TABLE_PCMSO_GHO;
} & IBaseDocumentModel;

export type ITablePcmsoHierarchy = {
  type: DocumentChildrenTypeEnum.TABLE_PCMSO_HIERARCHY;
} & IBaseDocumentModel;

export type ITablePcmsoHierarchyConcat = {
  type: DocumentChildrenTypeEnum.TABLE_PCMSO_HIERARCHY_CONCAT;
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
  | ITablePcmsoHierarchyConcat
  | IProfessional;
