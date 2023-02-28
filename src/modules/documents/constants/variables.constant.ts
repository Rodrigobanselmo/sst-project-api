import { DocumentTypeEnum } from '@prisma/client';
import { VariablesPGREnum } from '../docx/builders/pgr/enums/variables.enum';

type IVariableMap = Record<VariablesPGREnum, { type: VariablesPGREnum; accept: DocumentTypeEnum[]; label: string; active?: boolean; isBoolean?: boolean }>;

export const variableMap: IVariableMap = {
  //*main string
  [VariablesPGREnum.COMPANY_CEP]: {
    type: VariablesPGREnum.COMPANY_CEP,
    label: '',
  },
  [VariablesPGREnum.COMPANY_CITY]: {
    type: VariablesPGREnum.COMPANY_CITY,
    label: '',
  },
  [VariablesPGREnum.COMPANY_CNPJ]: {
    type: VariablesPGREnum.COMPANY_CNPJ,
    label: '',
  },
  [VariablesPGREnum.COMPANY_EMAIL]: {
    type: VariablesPGREnum.COMPANY_EMAIL,
    label: '',
  },
  [VariablesPGREnum.COMPANY_SIGNER_CITY]: {
    type: VariablesPGREnum.COMPANY_SIGNER_CITY,
    label: '',
  },
  [VariablesPGREnum.COMPANY_NAME]: {
    type: VariablesPGREnum.COMPANY_NAME,
    label: '',
  },
  [VariablesPGREnum.COMPANY_NEIGHBOR]: {
    type: VariablesPGREnum.COMPANY_NEIGHBOR,
    label: '',
  },
  [VariablesPGREnum.COMPANY_NUMBER]: {
    type: VariablesPGREnum.COMPANY_NUMBER,
    label: '',
  },
  [VariablesPGREnum.COMPANY_CNAE]: {
    type: VariablesPGREnum.COMPANY_CNAE,
    label: '',
  },
  [VariablesPGREnum.COMPANY_RISK_DEGREE]: {
    type: VariablesPGREnum.COMPANY_RISK_DEGREE,
    label: '',
  },
  [VariablesPGREnum.COMPANY_INITIAL]: {
    type: VariablesPGREnum.COMPANY_INITIAL,
    label: '',
  },
  [VariablesPGREnum.COMPANY_SHORT_NAME]: {
    type: VariablesPGREnum.COMPANY_SHORT_NAME,
    label: '',
  },
  [VariablesPGREnum.COMPANY_STATE]: {
    type: VariablesPGREnum.COMPANY_STATE,
    label: '',
  },
  [VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL]: {
    type: VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL,
    label: '',
  },
  [VariablesPGREnum.COMPANY_STREET]: {
    type: VariablesPGREnum.COMPANY_STREET,
    label: '',
  },
  [VariablesPGREnum.COMPANY_TELEPHONE]: {
    type: VariablesPGREnum.COMPANY_TELEPHONE,
    label: '',
  },
  [VariablesPGREnum.COMPANY_MISSION]: {
    type: VariablesPGREnum.COMPANY_MISSION,
    label: '',
  },
  [VariablesPGREnum.COMPANY_VISION]: {
    type: VariablesPGREnum.COMPANY_VISION,
    label: '',
  },
  [VariablesPGREnum.COMPANY_VALUES]: {
    type: VariablesPGREnum.COMPANY_VALUES,
    label: '',
  },
  [VariablesPGREnum.COMPANY_RESPONSIBLE]: {
    type: VariablesPGREnum.COMPANY_RESPONSIBLE,
    label: '',
  },
  [VariablesPGREnum.COMPANY_WORK_TIME]: {
    type: VariablesPGREnum.COMPANY_WORK_TIME,
    label: '',
  },
  [VariablesPGREnum.CONSULTANT_NAME]: {
    type: VariablesPGREnum.CONSULTANT_NAME,
    label: '',
  },
  [VariablesPGREnum.DOC_VALIDITY]: {
    type: VariablesPGREnum.DOC_VALIDITY,
    label: '',
  },
  [VariablesPGREnum.DOCUMENT_COORDINATOR]: {
    type: VariablesPGREnum.DOCUMENT_COORDINATOR,
    label: '',
  },
  [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_SYSTEMS]: {
    type: VariablesPGREnum.DOCUMENT_COMPLEMENTARY_SYSTEMS,
    label: '',
  },
  [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: {
    type: VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS,
    label: '',
  },
  [VariablesPGREnum.VERSION]: {
    type: VariablesPGREnum.VERSION,
    label: '',
  },
  //professional
  [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]: {
    type: VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS,
    label: '',
    active: false,
  },
  [VariablesPGREnum.PROFESSIONAL_CREA]: {
    type: VariablesPGREnum.PROFESSIONAL_CREA,
    label: '',
    active: false,
  },
  [VariablesPGREnum.PROFESSIONAL_FORMATION]: {
    type: VariablesPGREnum.PROFESSIONAL_FORMATION,
    label: '',
    active: false,
  },
  [VariablesPGREnum.PROFESSIONAL_NAME]: {
    type: VariablesPGREnum.PROFESSIONAL_NAME,
    label: '',
    active: false,
  },
  [VariablesPGREnum.PROFESSIONAL_CPF]: {
    type: VariablesPGREnum.PROFESSIONAL_CPF,
    label: '',
    active: false,
  },
  //attachment
  [VariablesPGREnum.ATTACHMENT_LINK]: {
    type: VariablesPGREnum.ATTACHMENT_LINK,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ATTACHMENT_NAME]: {
    type: VariablesPGREnum.ATTACHMENT_NAME,
    label: '',
    active: false,
  },
  //bulletTextIterable
  [VariablesPGREnum.BULLET_TEXT]: {
    type: VariablesPGREnum.BULLET_TEXT,
    label: '',
    active: false,
  },

  //*main boolean
  [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION]: {
    type: VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_AC]: {
    type: VariablesPGREnum.IS_AC,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_AL]: {
    type: VariablesPGREnum.IS_AL,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_AP]: {
    type: VariablesPGREnum.IS_AP,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_AM]: {
    type: VariablesPGREnum.IS_AM,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_BA]: {
    type: VariablesPGREnum.IS_BA,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_CE]: {
    type: VariablesPGREnum.IS_CE,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_DF]: {
    type: VariablesPGREnum.IS_DF,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_ES]: {
    type: VariablesPGREnum.IS_ES,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_GO]: {
    type: VariablesPGREnum.IS_GO,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_MA]: {
    type: VariablesPGREnum.IS_MA,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_MS]: {
    type: VariablesPGREnum.IS_MS,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_MT]: {
    type: VariablesPGREnum.IS_MT,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_MG]: {
    type: VariablesPGREnum.IS_MG,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_PA]: {
    type: VariablesPGREnum.IS_PA,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_PB]: {
    type: VariablesPGREnum.IS_PB,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_PR]: {
    type: VariablesPGREnum.IS_PR,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_PE]: {
    type: VariablesPGREnum.IS_PE,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_PI]: {
    type: VariablesPGREnum.IS_PI,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_RJ]: {
    type: VariablesPGREnum.IS_RJ,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_RN]: {
    type: VariablesPGREnum.IS_RN,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_RS]: {
    type: VariablesPGREnum.IS_RS,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_RO]: {
    type: VariablesPGREnum.IS_RO,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_RR]: {
    type: VariablesPGREnum.IS_RR,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_SC]: {
    type: VariablesPGREnum.IS_SC,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_SP]: {
    type: VariablesPGREnum.IS_SP,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_SE]: {
    type: VariablesPGREnum.IS_SE,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_TO]: {
    type: VariablesPGREnum.IS_TO,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_EMERGENCY_PLAN]: {
    type: VariablesPGREnum.HAS_EMERGENCY_PLAN,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_WORKSPACE_OWNER]: {
    type: VariablesPGREnum.IS_WORKSPACE_OWNER,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_NOT_WORKSPACE_OWNER]: {
    type: VariablesPGREnum.IS_NOT_WORKSPACE_OWNER,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_RISK_FIS]: {
    type: VariablesPGREnum.HAS_RISK_FIS,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_RISK_QUI]: {
    type: VariablesPGREnum.HAS_RISK_QUI,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_RISK_BIO]: {
    type: VariablesPGREnum.HAS_RISK_BIO,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_RISK_ERG]: {
    type: VariablesPGREnum.HAS_RISK_ERG,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_RISK_ACI]: {
    type: VariablesPGREnum.HAS_RISK_ACI,
    label: '',
    isBoolean: true,
  },

  //*PGR string --------------------->
  [VariablesPGREnum.CHAPTER_1]: {
    type: VariablesPGREnum.CHAPTER_1,
    label: '',
  },
  [VariablesPGREnum.CHAPTER_2]: {
    type: VariablesPGREnum.CHAPTER_2,
    label: '',
  },
  [VariablesPGREnum.CHAPTER_3]: {
    type: VariablesPGREnum.CHAPTER_3,
    label: '',
  },
  [VariablesPGREnum.CHAPTER_4]: {
    type: VariablesPGREnum.CHAPTER_4,
    label: '',
  },
  [VariablesPGREnum.WORKSPACE_CNPJ]: {
    type: VariablesPGREnum.WORKSPACE_CNPJ,
    label: '',
  },
  [VariablesPGREnum.ENVIRONMENT_DESCRIPTION]: {
    type: VariablesPGREnum.ENVIRONMENT_DESCRIPTION,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ENVIRONMENT_GENERAL_DESCRIPTION]: {
    type: VariablesPGREnum.ENVIRONMENT_GENERAL_DESCRIPTION,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ENVIRONMENT_IMAGES]: {
    type: VariablesPGREnum.ENVIRONMENT_IMAGES,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ENVIRONMENT_MOISTURE]: {
    type: VariablesPGREnum.ENVIRONMENT_MOISTURE,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ENVIRONMENT_NOISE]: {
    type: VariablesPGREnum.ENVIRONMENT_NOISE,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ENVIRONMENT_LUMINOSITY]: {
    type: VariablesPGREnum.ENVIRONMENT_LUMINOSITY,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ENVIRONMENT_TEMPERATURE]: {
    type: VariablesPGREnum.ENVIRONMENT_TEMPERATURE,
    label: '',
    active: false,
  },
  [VariablesPGREnum.ENVIRONMENT_NAME]: {
    type: VariablesPGREnum.ENVIRONMENT_NAME,
    label: '',
    active: false,
  },
  [VariablesPGREnum.PROFILE_NAME]: {
    type: VariablesPGREnum.PROFILE_NAME,
    label: '',
    active: false,
  },
  [VariablesPGREnum.CHARACTERIZATION_NAME]: {
    type: VariablesPGREnum.CHARACTERIZATION_NAME,
    label: '',
    active: false,
  },

  //*PGR boolean
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.COMPANY_HAS_GSE_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_GSE_RISK,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_QUANTITY]: {
    type: VariablesPGREnum.HAS_QUANTITY,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.IS_Q5]: {
    type: VariablesPGREnum.IS_Q5,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_QUANTITY_NOISE]: {
    type: VariablesPGREnum.HAS_QUANTITY_NOISE,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_QUANTITY_QUI]: {
    type: VariablesPGREnum.HAS_QUANTITY_QUI,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_QUANTITY_VFB]: {
    type: VariablesPGREnum.HAS_QUANTITY_VFB,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_QUANTITY_VL]: {
    type: VariablesPGREnum.HAS_QUANTITY_VL,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_QUANTITY_RAD]: {
    type: VariablesPGREnum.HAS_QUANTITY_RAD,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_QUANTITY_HEAT]: {
    type: VariablesPGREnum.HAS_QUANTITY_HEAT,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_EMERGENCY]: {
    type: VariablesPGREnum.HAS_EMERGENCY,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_HEAT]: {
    type: VariablesPGREnum.HAS_HEAT,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_VFB]: {
    type: VariablesPGREnum.HAS_VFB,
    label: '',
    isBoolean: true,
  },
  [VariablesPGREnum.HAS_VL]: {
    type: VariablesPGREnum.HAS_VL,
    label: '',
    isBoolean: true,
  },
};
