import { DocumentTypeEnum } from '@prisma/client';
import { VariablesPGREnum } from '../docx/builders/pgr/enums/variables.enum';

type IVariableMap = Record<VariablesPGREnum, { type: VariablesPGREnum; accept: DocumentTypeEnum[]; label: string; active?: boolean; isBoolean?: boolean }>;

export const variableMap: IVariableMap = {
  //*main string
  [VariablesPGREnum.COMPANY_CEP]: {
    type: VariablesPGREnum.COMPANY_CEP,
    label: 'CEP (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_CITY]: {
    type: VariablesPGREnum.COMPANY_CITY,
    label: 'CIDADE (ENDEREÇO EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_CNPJ]: {
    type: VariablesPGREnum.COMPANY_CNPJ,
    label: 'CNPJ (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_EMAIL]: {
    type: VariablesPGREnum.COMPANY_EMAIL,
    label: 'EMAIL PRINCIPAL (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_SIGNER_CITY]: {
    type: VariablesPGREnum.COMPANY_SIGNER_CITY,
    label: 'CIDADE DO RESPONSAVEL PELO DOCUMENTO',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_NAME]: {
    type: VariablesPGREnum.COMPANY_NAME,
    label: 'RAZÂO SOCIAL (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_NEIGHBOR]: {
    type: VariablesPGREnum.COMPANY_NEIGHBOR,
    label: 'BAIRRO (ENDEREÇO EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_NUMBER]: {
    type: VariablesPGREnum.COMPANY_NUMBER,
    label: 'NÙMERO (ENDEREÇO EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_CNAE]: {
    type: VariablesPGREnum.COMPANY_CNAE,
    label: 'CNAE (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_RISK_DEGREE]: {
    type: VariablesPGREnum.COMPANY_RISK_DEGREE,
    label: 'GRAU DE RISCO (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_INITIAL]: {
    type: VariablesPGREnum.COMPANY_INITIAL,
    label: 'SIGLA (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_SHORT_NAME]: {
    type: VariablesPGREnum.COMPANY_SHORT_NAME,
    label: 'NOME SIMPLIFICADO (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_STATE]: {
    type: VariablesPGREnum.COMPANY_STATE,
    label: 'UF / ESTADO (ENDEREÇO EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL]: {
    type: VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL,
    label: 'NÙMERO TOTAL DE EMPREGADOS (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_STREET]: {
    type: VariablesPGREnum.COMPANY_STREET,
    label: 'RUA (ENDEREÇO EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_TELEPHONE]: {
    type: VariablesPGREnum.COMPANY_TELEPHONE,
    label: 'TELEFONE PRINCIPAL (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_MISSION]: {
    type: VariablesPGREnum.COMPANY_MISSION,
    label: 'CEP (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
    active: false, //!
  },
  [VariablesPGREnum.COMPANY_VISION]: {
    type: VariablesPGREnum.COMPANY_VISION,
    label: 'CEP (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
    active: false, //!
  },
  [VariablesPGREnum.COMPANY_VALUES]: {
    type: VariablesPGREnum.COMPANY_VALUES,
    label: 'CEP (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
    active: false, //!
  },
  [VariablesPGREnum.COMPANY_RESPONSIBLE]: {
    type: VariablesPGREnum.COMPANY_RESPONSIBLE,
    label: 'RESPONSAVEL LEGAL DA EMPRESA (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.COMPANY_WORK_TIME]: {
    type: VariablesPGREnum.COMPANY_WORK_TIME,
    label: 'HORÁRIO DE FUNCIONAMENTO DO ESTABELECIMENTO (EMPRESA ATUAL)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.CONSULTANT_NAME]: {
    type: VariablesPGREnum.CONSULTANT_NAME,
    label: 'RAZÃO SOCIAL (EMPRESA DE CONSULTÓRIA)',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.DOC_VALIDITY]: {
    type: VariablesPGREnum.DOC_VALIDITY,
    label: 'VIGENCIA DO DOCUMENTO',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.DOCUMENT_COORDINATOR]: {
    type: VariablesPGREnum.DOCUMENT_COORDINATOR,
    label: 'COORDENADOR DO DOCUMENTO',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_SYSTEMS]: {
    type: VariablesPGREnum.DOCUMENT_COMPLEMENTARY_SYSTEMS,
    label: 'NOME SISTEMA COMPLEMENTAR',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: {
    type: VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS,
    label: 'NOME DOCUMENTO COMPLEMENTAR',
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.VERSION]: {
    type: VariablesPGREnum.VERSION,
    label: 'DATA E VERSAO DO DOCUMENTO',
    accept: [DocumentTypeEnum.OTHER],
  },
  //professional
  [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]: {
    type: VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS,
    label: 'CERTIFICACOES DO PROFISSIONAL',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.PROFESSIONAL_CREA]: {
    type: VariablesPGREnum.PROFESSIONAL_CREA,
    label: 'CREA DO PROFISSIONAL',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.PROFESSIONAL_FORMATION]: {
    type: VariablesPGREnum.PROFESSIONAL_FORMATION,
    label: 'FORMACAO DO PROFISSIONAL',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.PROFESSIONAL_NAME]: {
    type: VariablesPGREnum.PROFESSIONAL_NAME,
    label: 'NOME DO PROFISSIONAL',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.PROFESSIONAL_CPF]: {
    type: VariablesPGREnum.PROFESSIONAL_CPF,
    label: 'CPF DO PROFISSIONAL',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },
  //attachment
  [VariablesPGREnum.ATTACHMENT_LINK]: {
    type: VariablesPGREnum.ATTACHMENT_LINK,
    label: 'LINK PARA O ANEXO',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.ATTACHMENT_NAME]: {
    type: VariablesPGREnum.ATTACHMENT_NAME,
    label: 'NOME DO ANEXO',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },
  //bulletTextIterable
  [VariablesPGREnum.BULLET_TEXT]: {
    type: VariablesPGREnum.BULLET_TEXT,
    label: 'TEXTO DO MARCADOR',
    active: false,
    accept: [DocumentTypeEnum.OTHER],
  },

  //*main boolean
  [VariablesPGREnum.IS_AC]: {
    type: VariablesPGREnum.IS_AC,
    label: 'LOCALIZADO NO ESTADO DO ACRE',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_AL]: {
    type: VariablesPGREnum.IS_AL,
    label: 'LOCALIZADO NO ESTADO DE ALAGOAS',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_AP]: {
    type: VariablesPGREnum.IS_AP,
    label: 'LOCALIZADO NO ESTADO DO AMAPÁ',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_AM]: {
    type: VariablesPGREnum.IS_AM,
    label: 'LOCALIZADO NO ESTADO DO AMAZONAS',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_BA]: {
    type: VariablesPGREnum.IS_BA,
    label: 'LOCALIZADO NO ESTADO DA BAHIA',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_CE]: {
    type: VariablesPGREnum.IS_CE,
    label: 'LOCALIZADO NO ESTADO DO CEARÁ',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_DF]: {
    type: VariablesPGREnum.IS_DF,
    label: 'LOCALIZADO NO DISTRITO FEDERAL',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_ES]: {
    type: VariablesPGREnum.IS_ES,
    label: 'LOCALIZADO NO ESTADO DO ESPÍRITO SANTO',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_GO]: {
    type: VariablesPGREnum.IS_GO,
    label: 'LOCALIZADO NO ESTADO DE GOIÁS',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_MA]: {
    type: VariablesPGREnum.IS_MA,
    label: 'LOCALIZADO NO ESTADO DO MARANHÃO',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_MS]: {
    type: VariablesPGREnum.IS_MS,
    label: 'LOCALIZADO NO ESTADO DE MATO GROSSO DO SUL',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_MT]: {
    type: VariablesPGREnum.IS_MT,
    label: 'LOCALIZADO NO ESTADO DE MATO GROSSO',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_MG]: {
    type: VariablesPGREnum.IS_MG,
    label: 'LOCALIZADO NO ESTADO DE MINAS GERAIS',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_PA]: {
    type: VariablesPGREnum.IS_PA,
    label: 'LOCALIZADO NO ESTADO DO PARÁ',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_PB]: {
    type: VariablesPGREnum.IS_PB,
    label: 'LOCALIZADO NO ESTADO DA PARAÍBA',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_PR]: {
    type: VariablesPGREnum.IS_PR,
    label: 'LOCALIZADO NO ESTADO DO PARANÁ',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_PE]: {
    type: VariablesPGREnum.IS_PE,
    label: 'LOCALIZADO NO ESTADO DE PERNAMBUCO',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_PI]: {
    type: VariablesPGREnum.IS_PI,
    label: 'LOCALIZADO NO ESTADO DO PIAUÍ',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_RJ]: {
    type: VariablesPGREnum.IS_RJ,
    label: 'LOCALIZADO NO ESTADO DO RIO DE JANEIRO',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_RN]: {
    type: VariablesPGREnum.IS_RN,
    label: 'LOCALIZADO NO ESTADO DO RIO GRANDE DO NORTE',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_RS]: {
    type: VariablesPGREnum.IS_RS,
    label: 'LOCALIZADO NO ESTADO DO RIO GRANDE DO SUL',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_RO]: {
    type: VariablesPGREnum.IS_RO,
    label: 'LOCALIZADO NO ESTADO DE RONDÔNIA',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_RR]: {
    type: VariablesPGREnum.IS_RR,
    label: 'LOCALIZADO NO ESTADO DE RORAIMA',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_SC]: {
    type: VariablesPGREnum.IS_SC,
    label: 'LOCALIZADO NO ESTADO DE SANTA CATARINA',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_SP]: {
    type: VariablesPGREnum.IS_SP,
    label: 'LOCALIZADO NO ESTADO DE SÃO PAULO',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_SE]: {
    type: VariablesPGREnum.IS_SE,
    label: 'LOCALIZADO NO ESTADO DE SERGIPE',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [VariablesPGREnum.IS_TO]: {
    type: VariablesPGREnum.IS_TO,
    label: 'LOCALIZADO NO ESTADO DO TOCANTINS',
    isBoolean: true,
    accept: [DocumentTypeEnum.OTHER],
  },

  //*PGR string --------------------->
  [VariablesPGREnum.CHAPTER_1]: {
    type: VariablesPGREnum.CHAPTER_1,
    label: '',
    accept: [],
  },
  [VariablesPGREnum.CHAPTER_2]: {
    type: VariablesPGREnum.CHAPTER_2,
    label: '',
    accept: [],
  },
  [VariablesPGREnum.CHAPTER_3]: {
    type: VariablesPGREnum.CHAPTER_3,
    label: '',
    accept: [],
  },
  [VariablesPGREnum.CHAPTER_4]: {
    type: VariablesPGREnum.CHAPTER_4,
    label: '',
    accept: [],
  },

  [VariablesPGREnum.WORKSPACE_CNPJ]: {
    type: VariablesPGREnum.WORKSPACE_CNPJ,
    label: '',
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_DESCRIPTION]: {
    type: VariablesPGREnum.ENVIRONMENT_DESCRIPTION,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_GENERAL_DESCRIPTION]: {
    type: VariablesPGREnum.ENVIRONMENT_GENERAL_DESCRIPTION,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_IMAGES]: {
    type: VariablesPGREnum.ENVIRONMENT_IMAGES,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_MOISTURE]: {
    type: VariablesPGREnum.ENVIRONMENT_MOISTURE,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_NOISE]: {
    type: VariablesPGREnum.ENVIRONMENT_NOISE,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_LUMINOSITY]: {
    type: VariablesPGREnum.ENVIRONMENT_LUMINOSITY,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_TEMPERATURE]: {
    type: VariablesPGREnum.ENVIRONMENT_TEMPERATURE,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.ENVIRONMENT_NAME]: {
    type: VariablesPGREnum.ENVIRONMENT_NAME,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.PROFILE_NAME]: {
    type: VariablesPGREnum.PROFILE_NAME,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.CHARACTERIZATION_NAME]: {
    type: VariablesPGREnum.CHARACTERIZATION_NAME,
    label: '',
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },

  //*PGR boolean
  [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION]: {
    type: VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_EMERGENCY_PLAN]: {
    type: VariablesPGREnum.HAS_EMERGENCY_PLAN,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.IS_WORKSPACE_OWNER]: {
    type: VariablesPGREnum.IS_WORKSPACE_OWNER,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.IS_NOT_WORKSPACE_OWNER]: {
    type: VariablesPGREnum.IS_NOT_WORKSPACE_OWNER,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_RISK_FIS]: {
    type: VariablesPGREnum.HAS_RISK_FIS,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_RISK_QUI]: {
    type: VariablesPGREnum.HAS_RISK_QUI,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_RISK_BIO]: {
    type: VariablesPGREnum.HAS_RISK_BIO,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_RISK_ERG]: {
    type: VariablesPGREnum.HAS_RISK_ERG,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_RISK_ACI]: {
    type: VariablesPGREnum.HAS_RISK_ACI,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },

  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.COMPANY_HAS_GSE_RISK]: {
    type: VariablesPGREnum.COMPANY_HAS_GSE_RISK,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_QUANTITY]: {
    type: VariablesPGREnum.HAS_QUANTITY,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.IS_Q5]: {
    type: VariablesPGREnum.IS_Q5,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_QUANTITY_NOISE]: {
    type: VariablesPGREnum.HAS_QUANTITY_NOISE,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_QUANTITY_QUI]: {
    type: VariablesPGREnum.HAS_QUANTITY_QUI,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_QUANTITY_VFB]: {
    type: VariablesPGREnum.HAS_QUANTITY_VFB,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_QUANTITY_VL]: {
    type: VariablesPGREnum.HAS_QUANTITY_VL,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_QUANTITY_RAD]: {
    type: VariablesPGREnum.HAS_QUANTITY_RAD,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_QUANTITY_HEAT]: {
    type: VariablesPGREnum.HAS_QUANTITY_HEAT,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_EMERGENCY]: {
    type: VariablesPGREnum.HAS_EMERGENCY,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_HEAT]: {
    type: VariablesPGREnum.HAS_HEAT,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_VFB]: {
    type: VariablesPGREnum.HAS_VFB,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
  [VariablesPGREnum.HAS_VL]: {
    type: VariablesPGREnum.HAS_VL,
    label: '',
    isBoolean: true,
    accept: [DocumentTypeEnum.PGR],
  },
};
