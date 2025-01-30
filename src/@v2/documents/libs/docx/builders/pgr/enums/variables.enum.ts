export enum VariablesPGREnum {
  //*main string
  CURRENT_DATE_LONG = 'DATA_ATUAL_POR_EXTENSO',
  CURRENT_DATE_SHORT = 'DATA_ATUAL',
  COMPANY_CEP = 'CEP_EMPRESA',
  COMPANY_CITY = 'CIDADE_EMPRESA',
  COMPANY_CNPJ = 'CNPJ_EMPRESA',
  COMPANY_EMAIL = 'EMAIL_EMPRESA',
  COMPANY_SIGNER_CITY = 'CIDADE_DA_ASSINATURA', //! CHANGED
  COMPANY_NAME = 'RAZAO_SOCIAL',
  COMPANY_NEIGHBOR = 'BAIRRO_EMPRESA',
  COMPANY_NUMBER = 'NUMERO_EMPRESA',
  COMPANY_CNAE = 'CNAE_DA_EMPRESA',
  COMPANY_RISK_DEGREE = 'GRAU_DE_RISCO_DA_EMPRESA',
  COMPANY_INITIAL = 'SIGLA_DA_EMPRESA',
  COMPANY_SHORT_NAME = 'NOME_DA_EMPRESA',
  COMPANY_STATE = 'UF_EMPRESA',
  COMPANY_EMPLOYEES_TOTAL = 'NUMERO_TOTAL_DE_EMPREGADOS',
  COMPANY_STREET = 'LOGRADOURO_EMPRESA',
  COMPANY_TELEPHONE = 'TELEFONE_EMPRESA',
  COMPANY_MISSION = 'MISSÃO_DA_EMPRESA',
  COMPANY_VISION = 'VISÃO_DA_EMPRESA',
  COMPANY_VALUES = 'VALORES_DA_EMPRESA',
  COMPANY_RESPONSIBLE = 'RESPONSAVEL_LEGAL_DA_EMPRESA',
  COMPANY_WORK_TIME = 'HORARIO_DE_TRABALHO',
  CONSULTANT_NAME = 'NOME_EMPRESA_CONSULTORIA',
  DOC_VALIDITY = 'VIGENCIA_DO_DOCUMENTO',
  DOCUMENT_COORDINATOR = 'COORDENADOR_GERAL_DO_PROGRAMA',
  DOCUMENT_COMPLEMENTARY_SYSTEMS = 'SISTEMAS_DE_GESTÃO_EXISTENTES',
  DOCUMENT_COMPLEMENTARY_DOCS = 'DOCUMENTOS_COMPLEMENTARES',
  VERSION = 'VERSAO_E_DATA_DO_DOCUMENTO',
  //professional
  PROFESSIONAL_CERTIFICATIONS = 'CERTIFICADOS_DO_PROFISSIONAL',
  PROFESSIONAL_CREA = 'CREA_DO_PROFISSIONAL',
  PROFESSIONAL_FORMATION = 'FORMACAO_DO_PROFISSIONAL',
  PROFESSIONAL_NAME = 'NOME_DO_PROFISSIONAL',
  PROFESSIONAL_CPF = 'CPF_DO_PROFISSIONAL',
  //attachment
  ATTACHMENT_LINK = 'ATTACHMENT_LINK',
  ATTACHMENT_NAME = 'ATTACHMENT_NAME',
  //bulletTextIterable
  BULLET_TEXT = 'BULLET_TEXT',

  //*main boolean
  COMPANY_HAS_SST_CERTIFICATION = 'COMPANY_HAS_SST_CERTIFICATION',
  HAS_EMERGENCY_PLAN = 'HAS_EMERGENCY_PLAN',
  IS_WORKSPACE_OWNER = 'IS_WORKSPACE_OWNER',
  IS_NOT_WORKSPACE_OWNER = 'IS_NOT_WORKSPACE_OWNER',
  HAS_RISK_FIS = 'HAS_RISK_FIS',
  HAS_RISK_QUI = 'HAS_RISK_QUI',
  HAS_RISK_BIO = 'HAS_RISK_BIO',
  HAS_RISK_ERG = 'HAS_RISK_ERG',
  HAS_RISK_ACI = 'HAS_RISK_ACI',
  IS_AC = 'IS_AC',
  IS_AL = 'IS_AL',
  IS_AP = 'IS_AP',
  IS_AM = 'IS_AM',
  IS_BA = 'IS_BA',
  IS_CE = 'IS_CE',
  IS_DF = 'IS_DF',
  IS_ES = 'IS_ES',
  IS_GO = 'IS_GO',
  IS_MA = 'IS_MA',
  IS_MS = 'IS_MS',
  IS_MT = 'IS_MT',
  IS_MG = 'IS_MG',
  IS_PA = 'IS_PA',
  IS_PB = 'IS_PB',
  IS_PR = 'IS_PR',
  IS_PE = 'IS_PE',
  IS_PI = 'IS_PI',
  IS_RJ = 'IS_RJ',
  IS_RN = 'IS_RN',
  IS_RS = 'IS_RS',
  IS_RO = 'IS_RO',
  IS_RR = 'IS_RR',
  IS_SC = 'IS_SC',
  IS_SP = 'IS_SP',
  IS_SE = 'IS_SE',
  IS_TO = 'IS_TO',

  //*string --------------------->
  DOCUMENT_TITLE = 'TITULO_DO_DOCUMENTO',
  CHAPTER_1 = 'NOME_DO_CAPITULO_1',
  CHAPTER_2 = 'NOME_DO_CAPITULO_2',
  CHAPTER_3 = 'NOME_DO_CAPITULO_3',
  CHAPTER_4 = 'NOME_DO_CAPITULO_4',
  WORKSPACE_CNPJ = 'CNPJ_ESTABELECIMENTO',
  ENVIRONMENT_DESCRIPTION = 'DESCRIÇÃO_DO_AMBIENTE',
  ENVIRONMENT_GENERAL_DESCRIPTION = 'DESCRIÇÃO_GERAL_DO_AMBIENTE',
  ENVIRONMENT_IMAGES = 'FOTOS_DO_AMBIENTE',
  ENVIRONMENT_MOISTURE = 'HUMIDADE_DO_AMBIENTE',
  ENVIRONMENT_NOISE = 'RUIDO_DO_AMBIENTE',
  ENVIRONMENT_LUMINOSITY = 'LUMINOSIDADE_DO_AMBIENTE',
  ENVIRONMENT_TEMPERATURE = 'TEMPERATURA_DO_AMBIENTE',
  ENVIRONMENT_NAME = 'NOME_DO_AMBIENTE',
  PROFILE_NAME = 'NOME_DO_PERFIL_AMBIENTE',
  CHARACTERIZATION_NAME = 'NOME_DO_POSTO_E_ATIVIDADE',

  //*PGR boolean
  COMPANY_HAS_ENVIRONMENT_GENERAL = 'COMPANY_HAS_ENVIRONMENT_GENERAL',
  COMPANY_HAS_ENVIRONMENT_ADM = 'COMPANY_HAS_ENVIRONMENT_ADM',
  COMPANY_HAS_ENVIRONMENT_OP = 'COMPANY_HAS_ENVIRONMENT_OP',
  COMPANY_HAS_ENVIRONMENT_SUP = 'COMPANY_HAS_ENVIRONMENT_SUP',
  COMPANY_HAS_CHARACTERIZATION_ACT = 'COMPANY_HAS_CHARACTERIZATION_ACT',
  COMPANY_HAS_CHARACTERIZATION_WORK = 'COMPANY_HAS_CHARACTERIZATION_WORK',
  COMPANY_HAS_CHARACTERIZATION_EQUIP = 'COMPANY_HAS_CHARACTERIZATION_EQUIP',
  COMPANY_HAS_ENVIRONMENT_RISK = 'COMPANY_HAS_ENVIRONMENT_RISK',
  COMPANY_HAS_CHARACTERIZATION_RISK = 'COMPANY_HAS_CHARACTERIZATION_RISK',
  COMPANY_HAS_HIERARCHY_RISK = 'COMPANY_HAS_HIERARCHY_RISK',
  COMPANY_HAS_GSE_RISK = 'COMPANY_HAS_GSE_RISK',
  HAS_QUANTITY = 'HAS_QUANTITY',
  IS_Q5 = 'IS_Q5',
  IS_HIDE_CA = 'IS_HIDE_CA',
  IS_HIDE_ORIGIN_COLUMN = 'IS_HIDE_ORIGIN_COLUMN',
  HAS_QUANTITY_NOISE = 'HAS_QUANTITY_NOISE',
  HAS_QUANTITY_QUI = 'HAS_QUANTITY_QUI',
  HAS_QUANTITY_VFB = 'HAS_QUANTITY_VFB',
  HAS_QUANTITY_VL = 'HAS_QUANTITY_VL',
  HAS_QUANTITY_RAD = 'HAS_QUANTITY_RAD',
  HAS_QUANTITY_HEAT = 'HAS_QUANTITY_HEAT',
  HAS_EMERGENCY = 'HAS_EMERGENCY',
  HAS_HEAT = 'HAS_HEAT',
  HAS_VFB = 'HAS_VFB',
  HAS_VL = 'HAS_VL',
}
