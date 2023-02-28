import { DocumentSectionChildrenTypeEnum, ISectionChildrenType } from '../docx/builders/pgr/types/elements.types';

type IDocumentElementTypeMap = Record<
  DocumentSectionChildrenTypeEnum,
  ISectionChildrenType & { label: string; active?: boolean; isParagraph?: boolean; isBullet?: boolean }
>;

export const documentElementTypeMap: IDocumentElementTypeMap = {
  [DocumentSectionChildrenTypeEnum.TITLE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TITLE,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.H1]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.H1,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.H2]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.H2,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.H3]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.H3,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.H4]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.H4,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.H5]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.H5,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.H6]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.H6,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.PARAGRAPH]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
    text: '',
    isParagraph: true,
  },
  [DocumentSectionChildrenTypeEnum.BREAK]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.BREAK,
    isParagraph: true,
  },
  [DocumentSectionChildrenTypeEnum.BULLET]: {
    type: DocumentSectionChildrenTypeEnum.BULLET,
    label: '',
    text: '',
    isBullet: true,
  },
  [DocumentSectionChildrenTypeEnum.BULLET_SPACE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL,
  },
  [DocumentSectionChildrenTypeEnum.ATTACHMENTS]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ATTACHMENTS,
  },
  [DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
    text: '',
  },
  [DocumentSectionChildrenTypeEnum.LEGEND]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.LEGEND,
    text: '',
    isParagraph: true,
  },
  [DocumentSectionChildrenTypeEnum.PROFESSIONAL]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.PROFESSIONAL,
  },
  [DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES,
  },
  [DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE,
    text: '',
  },

  //*PGR string --------------------->
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_GSE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_GSE,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY,
  },

  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG,
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI,
  },

  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD,
  },

  [DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE,
  },
  [DocumentSectionChildrenTypeEnum.RISK_TABLE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.RISK_TABLE,
  },
  [DocumentSectionChildrenTypeEnum.MEASURE_IMAGE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.MEASURE_IMAGE,
  },
  [DocumentSectionChildrenTypeEnum.RS_IMAGE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.RS_IMAGE,
  },
  [DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS,
  },
  [DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS,
  },
  [DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
  },
  [DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES,
  },
  [DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE,
  },
  [DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES,
  },
  [DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES,
  },
  [DocumentSectionChildrenTypeEnum.MATRIX_TABLES]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.MATRIX_TABLES,
  },
  [DocumentSectionChildrenTypeEnum.APR_TABLE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.APR_TABLE,
  },
  [DocumentSectionChildrenTypeEnum.PLAN_TABLE]: {
    label: '',
    type: DocumentSectionChildrenTypeEnum.PLAN_TABLE,
  },
};
