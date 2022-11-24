import { ISectionChildrenType } from '../types/elements.types';
import { IDocVariables } from '../types/section.types';
export declare const convertToDocxHelper: (data: ISectionChildrenType, variables: IDocVariables) => {
    children?: import("docx").ParagraphChild[];
    border?: import("docx").IBordersOptions;
    heading?: import("docx").HeadingLevel;
    bidirectional?: boolean;
    pageBreakBefore?: boolean;
    tabStops?: {
        readonly position: number;
        readonly type: import("docx").TabStopType;
        readonly leader?: import("docx").LeaderType;
    }[];
    style?: string;
    bullet?: {
        readonly level: number;
    };
    shading?: import("docx").IShadingAttributesProperties;
    widowControl?: boolean;
    frame?: import("docx").IFrameOptions;
    suppressLineNumbers?: boolean;
    numbering?: {
        readonly reference: string;
        readonly level: number;
        readonly instance?: number;
        readonly custom?: boolean;
    };
    alignment?: import("docx").AlignmentType;
    thematicBreak?: boolean;
    contextualSpacing?: boolean;
    rightTabStop?: number;
    leftTabStop?: number;
    indent?: import("docx").IIndentAttributesProperties;
    spacing?: import("docx").ISpacingProperties;
    keepNext?: boolean;
    keepLines?: boolean;
    outlineLevel?: number;
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.BULLET;
    level?: 0 | 1 | 6 | 5 | 4 | 2 | 3;
    text: string;
    size?: number;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.BULLET_SPACE;
    text: string;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.H1;
    text: string;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.H2;
    text: string;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.H3;
    text: string;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.H4;
    text: string;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    text: string;
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.H5;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.H6;
    text: string;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TITLE;
    text: string;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    children?: import("docx").ParagraphChild[];
    border?: import("docx").IBordersOptions;
    heading?: import("docx").HeadingLevel;
    bidirectional?: boolean;
    pageBreakBefore?: boolean;
    tabStops?: {
        readonly position: number;
        readonly type: import("docx").TabStopType;
        readonly leader?: import("docx").LeaderType;
    }[];
    style?: string;
    bullet?: {
        readonly level: number;
    };
    shading?: import("docx").IShadingAttributesProperties;
    widowControl?: boolean;
    frame?: import("docx").IFrameOptions;
    suppressLineNumbers?: boolean;
    numbering?: {
        readonly reference: string;
        readonly level: number;
        readonly instance?: number;
        readonly custom?: boolean;
    };
    alignment?: import("docx").AlignmentType;
    thematicBreak?: boolean;
    contextualSpacing?: boolean;
    rightTabStop?: number;
    leftTabStop?: number;
    indent?: import("docx").IIndentAttributesProperties;
    spacing?: import("docx").ISpacingProperties;
    keepNext?: boolean;
    keepLines?: boolean;
    outlineLevel?: number;
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.PARAGRAPH;
    text: string;
    size?: number;
    color?: string;
    align?: import("docx").AlignmentType;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    children?: import("docx").ParagraphChild[];
    border?: import("docx").IBordersOptions;
    heading?: import("docx").HeadingLevel;
    bidirectional?: boolean;
    pageBreakBefore?: boolean;
    tabStops?: {
        readonly position: number;
        readonly type: import("docx").TabStopType;
        readonly leader?: import("docx").LeaderType;
    }[];
    style?: string;
    bullet?: {
        readonly level: number;
    };
    shading?: import("docx").IShadingAttributesProperties;
    widowControl?: boolean;
    frame?: import("docx").IFrameOptions;
    suppressLineNumbers?: boolean;
    numbering?: {
        readonly reference: string;
        readonly level: number;
        readonly instance?: number;
        readonly custom?: boolean;
    };
    alignment?: import("docx").AlignmentType;
    thematicBreak?: boolean;
    contextualSpacing?: boolean;
    rightTabStop?: number;
    leftTabStop?: number;
    indent?: import("docx").IIndentAttributesProperties;
    spacing?: import("docx").ISpacingProperties;
    keepNext?: boolean;
    keepLines?: boolean;
    outlineLevel?: number;
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.LEGEND;
    text: string;
    color?: string;
    size?: number;
    align?: import("docx").AlignmentType;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    children?: import("docx").ParagraphChild[];
    size?: number;
    text: string;
    color?: string;
    align?: import("docx").AlignmentType;
    border?: import("docx").IBordersOptions;
    heading?: import("docx").HeadingLevel;
    bidirectional?: boolean;
    pageBreakBefore?: boolean;
    tabStops?: {
        readonly position: number;
        readonly type: import("docx").TabStopType;
        readonly leader?: import("docx").LeaderType;
    }[];
    style?: string;
    bullet?: {
        readonly level: number;
    };
    shading?: import("docx").IShadingAttributesProperties;
    widowControl?: boolean;
    frame?: import("docx").IFrameOptions;
    suppressLineNumbers?: boolean;
    numbering?: {
        readonly reference: string;
        readonly level: number;
        readonly instance?: number;
        readonly custom?: boolean;
    };
    alignment?: import("docx").AlignmentType;
    thematicBreak?: boolean;
    contextualSpacing?: boolean;
    rightTabStop?: number;
    leftTabStop?: number;
    indent?: import("docx").IIndentAttributesProperties;
    spacing?: import("docx").ISpacingProperties;
    keepNext?: boolean;
    keepLines?: boolean;
    outlineLevel?: number;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE;
} | {
    children?: import("docx").ParagraphChild[];
    size?: number;
    text: string;
    color?: string;
    align?: import("docx").AlignmentType;
    border?: import("docx").IBordersOptions;
    heading?: import("docx").HeadingLevel;
    bidirectional?: boolean;
    pageBreakBefore?: boolean;
    tabStops?: {
        readonly position: number;
        readonly type: import("docx").TabStopType;
        readonly leader?: import("docx").LeaderType;
    }[];
    style?: string;
    bullet?: {
        readonly level: number;
    };
    shading?: import("docx").IShadingAttributesProperties;
    widowControl?: boolean;
    frame?: import("docx").IFrameOptions;
    suppressLineNumbers?: boolean;
    numbering?: {
        readonly reference: string;
        readonly level: number;
        readonly instance?: number;
        readonly custom?: boolean;
    };
    alignment?: import("docx").AlignmentType;
    thematicBreak?: boolean;
    contextualSpacing?: boolean;
    rightTabStop?: number;
    leftTabStop?: number;
    indent?: import("docx").IIndentAttributesProperties;
    spacing?: import("docx").ISpacingProperties;
    keepNext?: boolean;
    keepLines?: boolean;
    outlineLevel?: number;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE;
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.BREAK;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.PROFESSIONAL;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.COMPLEMENTARY_DOCS;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_GSE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.MATRIX_TABLES;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.MEASURE_IMAGE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.RS_IMAGE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.RISK_TABLE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_QUANTITY_QUI;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VFB;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VL;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.TABLE_QUANTITY_RAD;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.APR_TABLE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.PLAN_TABLE;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ATTACHMENTS;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
} | {
    type: import("../types/elements.types").PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI;
    removeWithSomeEmptyVars?: string[];
    removeWithAllEmptyVars?: string[];
    removeWithAllValidVars?: string[];
    addWithAllVars?: string[];
};
