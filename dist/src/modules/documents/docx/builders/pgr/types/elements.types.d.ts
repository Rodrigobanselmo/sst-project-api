import { AlignmentType, IParagraphOptions } from 'docx';
export declare enum PGRSectionChildrenTypeEnum {
    TITLE = "TITLE",
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    H4 = "H4",
    H5 = "H5",
    H6 = "H6",
    PARAGRAPH = "PARAGRAPH",
    BREAK = "BREAK",
    BULLET = "BULLET",
    BULLET_SPACE = "BULLET_SPACE",
    TABLE_VERSION_CONTROL = "TABLE_VERSION_CONTROL",
    ITERABLE_ENVIRONMENTS_ADM = "ITERABLE_ENVIRONMENTS",
    ITERABLE_ENVIRONMENTS_OP = "ITERABLE_ENVIRONMENTS_OP",
    ITERABLE_ENVIRONMENTS_SUP = "ITERABLE_ENVIRONMENTS_SUP",
    ITERABLE_ENVIRONMENTS_GENERAL = "ITERABLE_ENVIRONMENTS_GENERAL",
    ITERABLE_CHARACTERIZATION_EQUIP = "ITERABLE_CHARACTERIZATION_EQUIP",
    ITERABLE_CHARACTERIZATION_ACTIVIT = "ITERABLE_CHARACTERIZATION_ACTIVIT",
    ITERABLE_CHARACTERIZATION_WORKSTATION = "ITERABLE_CHARACTERIZATION_WORKSTATION",
    ITERABLE_RECOMMENDATIONS = "ITERABLE_RECOMMENDATIONS",
    ITERABLE_EMERGENCY_RISKS = "ITERABLE_EMERGENCY_RISKS",
    TABLE_GSE = "TABLE_GSE",
    TABLE_HIERARCHY_ENV = "TABLE_HIERARCHY_ENV",
    TABLE_HIERARCHY_CHAR = "TABLE_HIERARCHY_CHAR",
    TABLE_PRIORITIZATION = "TABLE_PRIORITIZATION",
    TABLE_PRIORITIZATION_ENV = "TABLE_PRIORITIZATION_ENV",
    TABLE_PRIORITIZATION_CHAR = "TABLE_PRIORITIZATION_CHAR",
    TABLE_PRIORITIZATION_HIERARCHY = "TABLE_PRIORITIZATION_HIERARCHY",
    ITERABLE_QUALITY_FIS = "ITERABLE_QUALITY_FIS",
    ITERABLE_QUALITY_QUI = "ITERABLE_QUALITY_QUI",
    ITERABLE_QUALITY_BIO = "ITERABLE_QUALITY_BIO",
    ITERABLE_QUALITY_ERG = "ITERABLE_QUALITY_ERG",
    ITERABLE_QUALITY_ACI = "ITERABLE_QUALITY_ACI",
    TABLE_QUANTITY_NOISE = "TABLE_QUANTITY_NOISE",
    TABLE_QUANTITY_QUI = "TABLE_QUANTITY_QUI",
    TABLE_QUANTITY_HEAT = "TABLE_QUANTITY_HEAT",
    TABLE_QUANTITY_VFB = "TABLE_QUANTITY_VFB",
    TABLE_QUANTITY_VL = "TABLE_QUANTITY_VL",
    TABLE_QUANTITY_RAD = "TABLE_QUANTITY_RAD",
    HIERARCHY_RISK_TABLE = "HIERARCHY_RISK_TABLE",
    RISK_TABLE = "RISK_TABLE",
    PARAGRAPH_TABLE = "PARAGRAPH_TABLE",
    LEGEND = "LEGEND",
    MEASURE_IMAGE = "MEASURE_IMAGE",
    RS_IMAGE = "RS_IMAGE",
    PARAGRAPH_FIGURE = "PARAGRAPH_FIGURE",
    PROFESSIONAL = "PROFESSIONAL",
    PROFESSIONALS_SIGNATURES = "PROFESSIONALS_SIGNATURES",
    COMPLEMENTARY_DOCS = "COMPLEMENTARY_DOCS",
    COMPLEMENTARY_SYSTEMS = "COMPLEMENTARY_SYSTEMS",
    HEALTH_EFFECT_TABLES = "HEALTH_EFFECT_TABLES",
    EXPOSITION_DEGREE_TABLES = "EXPOSITION_DEGREE_TABLES",
    HIERARCHY_ORG_TABLE = "HIERARCHY_ORG_TABLE",
    QUANTITY_RESULTS_TABLES = "QUANTITY_RESULTS_TABLES",
    MATRIX_TABLES = "MATRIX_TABLES",
    APR_TABLE = "APR_TABLE",
    PLAN_TABLE = "PLAN_TABLE",
    ATTACHMENTS = "ATTACHMENTS"
}
interface IBase {
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
}
export declare type IBullet = Omit<IParagraphOptions, 'text'> & {
    type: PGRSectionChildrenTypeEnum.BULLET;
    level?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
    size?: number;
} & IBase;
export declare type IBulletSpace = {
    type: PGRSectionChildrenTypeEnum.BULLET_SPACE;
    text: string;
} & IBase;
export declare type IH1 = {
    type: PGRSectionChildrenTypeEnum.H1;
    text: string;
} & IBase;
export declare type IH2 = {
    type: PGRSectionChildrenTypeEnum.H2;
    text: string;
} & IBase;
export declare type IH3 = {
    type: PGRSectionChildrenTypeEnum.H3;
    text: string;
} & IBase;
export declare type IH4 = {
    type: PGRSectionChildrenTypeEnum.H4;
    text: string;
} & IBase;
export declare type IH5 = {
    text: string;
    type: PGRSectionChildrenTypeEnum.H5;
} & IBase;
export declare type IH6 = {
    type: PGRSectionChildrenTypeEnum.H6;
    text: string;
} & IBase;
export declare type ITitle = {
    type: PGRSectionChildrenTypeEnum.TITLE;
    text: string;
} & IBase;
export declare type IParagraph = Omit<IParagraphOptions, 'text'> & {
    type: PGRSectionChildrenTypeEnum.PARAGRAPH;
    text: string;
    size?: number;
    color?: string;
    align?: AlignmentType;
} & IBase;
export declare type ILegend = Omit<IParagraphOptions, 'text'> & {
    type: PGRSectionChildrenTypeEnum.LEGEND;
    text: string;
    color?: string;
    size?: number;
    align?: AlignmentType;
} & IBase;
export declare type IParagraphTable = Omit<IParagraph, 'type'> & {
    type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE;
} & IBase;
export declare type IParagraphFigure = Omit<IParagraph, 'type'> & {
    type: PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE;
} & IBase;
export declare type IBreak = {
    type: PGRSectionChildrenTypeEnum.BREAK;
} & IBase;
export declare type ITableVersionControl = {
    type: PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
} & IBase;
export declare type IEnvironmentsAdm = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM;
} & IBase;
export declare type IEnvironmentsGeneral = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL;
} & IBase;
export declare type IEnvironmentsOp = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP;
} & IBase;
export declare type IEnvironmentsSup = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP;
} & IBase;
export declare type ICharacterizationEquip = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP;
} & IBase;
export declare type ICharacterizationActivity = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT;
} & IBase;
export declare type ICharacterizationWork = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION;
} & IBase;
export declare type IProfessional = {
    type: PGRSectionChildrenTypeEnum.PROFESSIONAL;
} & IBase;
export declare type IProfessionalSignature = {
    type: PGRSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES;
} & IBase;
export declare type IComplementaryDocs = {
    type: PGRSectionChildrenTypeEnum.COMPLEMENTARY_DOCS;
} & IBase;
export declare type IComplementarySystems = {
    type: PGRSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS;
} & IBase;
export declare type IHealthEffectTable = {
    type: PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES;
} & IBase;
export declare type IExpositionTable = {
    type: PGRSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES;
} & IBase;
export declare type IGseTable = {
    type: PGRSectionChildrenTypeEnum.TABLE_GSE;
} & IBase;
export declare type IGseEnvTable = {
    type: PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV;
} & IBase;
export declare type IGseCharTable = {
    type: PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR;
} & IBase;
export declare type IMatrix = {
    type: PGRSectionChildrenTypeEnum.MATRIX_TABLES;
} & IBase;
export declare type IQuantityTable = {
    type: PGRSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES;
} & IBase;
export declare type IMeasureImage = {
    type: PGRSectionChildrenTypeEnum.MEASURE_IMAGE;
} & IBase;
export declare type IRSImage = {
    type: PGRSectionChildrenTypeEnum.RS_IMAGE;
} & IBase;
export declare type IHierarchyTable = {
    type: PGRSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE;
} & IBase;
export declare type IHierarchyRiskTable = {
    type: PGRSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE;
} & IBase;
export declare type IRiskTable = {
    type: PGRSectionChildrenTypeEnum.RISK_TABLE;
} & IBase;
export declare type IPrioritization = {
    type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION;
} & IBase;
export declare type IPrioritizationH = {
    type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY;
} & IBase;
export declare type IPrioritizationE = {
    type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV;
} & IBase;
export declare type IPrioritizationC = {
    type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR;
} & IBase;
export declare type IQuantityNoise = {
    type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE;
} & IBase;
export declare type IQuantityQui = {
    type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_QUI;
} & IBase;
export declare type IQuantityHeat = {
    type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT;
} & IBase;
export declare type IQuantityVFB = {
    type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VFB;
} & IBase;
export declare type IQuantityVL = {
    type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VL;
} & IBase;
export declare type IQuantityRad = {
    type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_RAD;
} & IBase;
export declare type IRecommendations = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS;
} & IBase;
export declare type IEmergency = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS;
} & IBase;
export declare type IApr = {
    type: PGRSectionChildrenTypeEnum.APR_TABLE;
} & IBase;
export declare type IPlan = {
    type: PGRSectionChildrenTypeEnum.PLAN_TABLE;
} & IBase;
export declare type IAttachments = {
    type: PGRSectionChildrenTypeEnum.ATTACHMENTS;
} & IBase;
export declare type IIterableFis = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS;
} & IBase;
export declare type IIterableQui = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI;
} & IBase;
export declare type IIterableBio = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO;
} & IBase;
export declare type IIterableErg = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG;
} & IBase;
export declare type IIterableArc = {
    type: PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI;
} & IBase;
export declare type ISectionChildrenType = IH1 | IH2 | IH3 | IH4 | IH5 | IH6 | IParagraph | IBreak | ITitle | IBullet | IBulletSpace | ITableVersionControl | IParagraphTable | ILegend | IParagraphFigure | IComplementarySystems | IHealthEffectTable | IExpositionTable | IHierarchyTable | IHierarchyRiskTable | IRiskTable | IMatrix | IQuantityNoise | IQuantityQui | IQuantityHeat | IQuantityVFB | IQuantityVL | IQuantityRad | IQuantityTable | IComplementaryDocs | IEnvironmentsAdm | IEnvironmentsSup | IEnvironmentsOp | IEnvironmentsGeneral | ICharacterizationEquip | ICharacterizationActivity | ICharacterizationWork | IMeasureImage | IRSImage | IGseTable | IPrioritization | IPrioritizationH | IPrioritizationE | IPrioritizationC | IRecommendations | IGseCharTable | IGseEnvTable | IEmergency | IApr | IPlan | IIterableFis | IIterableQui | IIterableBio | IIterableErg | IIterableArc | IAttachments | IProfessionalSignature | IProfessional;
export {};
