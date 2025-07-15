import { normalizeToUpperString } from '../../../../../../../shared/utils/normalizeString';
import { SexTypeEnumTranslateBrToUs, SexTypeEnumTranslatedNotes } from '../../../../../../../shared/utils/translate/sexType.translate';
import { RiskFactorsEnumTranslateBrToUs, RiskFactorsEnumTranslatedNotes } from '../../../../../../../shared/utils/translate/riskFactors.translate';
import { checkIsValidCpf } from '../../../../../../../shared/utils/validators/checkIsValidCpf';
import { ReportColorEnum, ReportFillColorEnum } from '../../../../report/types/IReportFactory.types';
import { ClothesIBTUG, clothesList } from '../../../../../../../shared/constants/maps/ibtu-clothes.map';
import { checkIsValidDate } from '../../../../../../../shared/utils/validators/checkIsValidDate';
import { checkIsBoolean } from '../../../../../../../shared/utils/validators/checkIsBoolean';
import { checkIsNumber } from '../../../../../../../shared/utils/validators/checkIdNumber';
import { IColumnRuleMap, ISheetRuleMap } from '../../../types/IFileFactory.types';
import { checkIsString } from '../../../../../../../shared/utils/validators/checkIsString';
import { checkIsEnum } from '../../../../../../../shared/utils/validators/checkIsEnum';
import { SexTypeEnum, RiskFactorsEnum } from '@prisma/client';

export const emptyHierarchy = '!!';

export enum CompanyStructHeaderEnum {
  // COMPANY_SIGLA = 'Sigla (Empresa)',
  WORKSPACE = 'Nome Estabelecimento',

  EMPLOYEE_CPF = 'CPF do empregado',
  EMPLOYEE_NAME = 'Nome do empregado',
  EMPLOYEE_BIRTH = 'Nascimento',
  EMPLOYEE_SEX = 'Sexo',
  EMPLOYEE_ADMISSION = 'Data admissão',
  ESOCIAL_CODE = 'Matricula eSocial',
  LAST_EXAM = 'Data último exame',
  EMPLOYEE_DEMISSION = 'Data demissão',
  EMPLOYEE_PHONE = 'Telefone (Whatsapp)',
  EMPLOYEE_EMAIL = 'E-mail',
  EMPLOYEE_SOCIAL_NAME = 'Nome social do empregado',
  EMPLOYEE_RG = 'RG',
  EMPLOYEE_IS_PCD = 'Funcionário PCD',
  EMPLOYEE_CIDS = 'CID',

  DIRECTORY = 'Superintendência',
  MANAGEMENT = 'Diretoria',
  SECTOR = 'Setor',
  SUB_SECTOR = 'Sub Setor',
  OFFICE = 'Cargo',
  SUB_OFFICE = 'Cargo desenvolvido',
  OFFICE_DESCRIPTION = 'Descrição do cargo',
  OFFICE_REAL_DESCRIPTION = 'Descrição real do cargo (entrevista com trabalhador)',
  CBO = 'Código CBO',

  GHO = 'Grupo Homogênio',
  GHO_DESCRIPTION = 'Descrição do GSE',

  // AMB_GENERAL = 'Ambiante (Visão Geral)',
  // AMB_ADM = 'Ambiante (Adm)',
  // AMB_SUP = 'Ambiante (Apoio)',
  // AMB_OP = 'Ambiante (Operacional)',
  // POSTO_DE_TRABALHO = 'Posto de Trabalho',
  // ACTIVITY = 'Atividade',
  // EQUIPMENT = 'Equipamento',

  RISK = 'Risco',
  RISK_SEVERITY = 'Severidade do Risco',
  RISK_DESCRIPTION = 'Descrição do Risco',
  RISK_SYMPTOMS = 'Sintomas do Risco',
  RISK_TYPE = 'Tipo do Risco',
  PROB = 'Probabilidade',
  GENERATE_SOURCE = 'Fonte Geradora',

  AREN = 'AREN',
  VDVR = 'VDVR',

  DBA_NR15_Q5 = 'db(A)',
  DBA_LTCAT_Q5 = 'LTCAT db(A) Q5',
  DBA_LTCAT_Q3 = 'LTCAT db(A) Q3',

  NR15LT = 'NR15 / CMPT',
  TWA_ACGH = 'Valor TLV/TWA (ACGIH)',
  STEL = 'Valor STEL (TETO - ACGH)',
  VMP = 'NR15 / VMP',
  UNIT = 'Unidade de médida (NR15 / ACGH)',

  IBTUG = 'IBUTG [°C]',
  MW = 'Taxa metabólica M[W]',
  IS_ACCLIMATIZED = 'Trabalhador aclimatizado?',
  CLOTHES_TYPE = 'Tipo Vestimento (IBUTG)',

  // DOSE_FB = 'Dose Corpo Inteiro',
  // DOSE_FB_PUBLIC = 'Dose Corpo Inteiro Público',
  // DOSE_EYE = 'Dose Olho',
  // DOSE_EYE_PUBLIC = 'Dose Olho Público',
  // DOSE_SKIN = 'Dose Pele',
  // DOSE_SKIN_PUBLIC = 'Dose Pele Público',
  // DOSE_HEAD = 'Dose Cabeça',

  EPI_CA = 'CA (EPI)',
  EPI_EFFICIENTLY = '(EPI) Eficaz?',
  EPI_EPC = '(EPI)  Foi tentada a implementação de medidas de proteção coletiva, de caráter administrativo ou de organização, ...?',
  EPI_LONG_PERIODS = '(EPI)  Foram observadas as condições de funcionamento e do uso ininterrupto do EPI ao longo do tempo, ...?',
  EPI_VALIDATION = '(EPI)  Foi observado o prazo de validade, conforme Certificado de Aprovação - CA do MTE?',
  EPI_TRADE_SIGN = '(EPI) Foi observada a periodicidade de troca definida pelos programas ambientais, comprovada mediante recibo assinado pelo usuário em época própria?',
  EPI_SANITATION = '(EPI) Foi observada a higienização?',
  EPI_MAINTENANCE = '(EPI) É observada a manutenção conforme orientação do fabricante nacional ou importador?',
  EPI_UNSTOPPED = '(EPI) Foi observado o uso ininterrupto do EPI ao longo do tempo?',
  EPI_TRAINING = '(EPI) Treinamento',
  EPC = 'EPC',
  EPC_EFFICIENTLY = '(EPC) Eficaz?',
  EPC_OTHERS = 'Outras Medidas de Controle',
  REC = 'Recomendações',
  PROB_REC = 'Probabilidade Residual',

  START_DATE = 'Data início condição',
  END_DATE = 'Data fim condição',
}

export const CompanyStructSheetMap: ISheetRuleMap = {};

export const CompanyStructColumnMap: IColumnRuleMap<CompanyStructHeaderEnum> = {
  // [CompanyStructHeaderEnum.COMPANY_SIGLA]: {
  //   field: CompanyStructHeaderEnum.COMPANY_SIGLA,
  //   checkHandler: checkIsString,
  // },

  [CompanyStructHeaderEnum.WORKSPACE]: {
    field: CompanyStructHeaderEnum.WORKSPACE,
    checkHandler: checkIsString,
    width: 80,
    database: 'workspace',
  },

  [CompanyStructHeaderEnum.EMPLOYEE_CPF]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_CPF,
    checkHandler: checkIsValidCpf,
    database: 'cpf',
    requiredIfOneExist: [
      CompanyStructHeaderEnum.EMPLOYEE_NAME,
      CompanyStructHeaderEnum.EMPLOYEE_ADMISSION,
      CompanyStructHeaderEnum.EMPLOYEE_DEMISSION,
      CompanyStructHeaderEnum.EMPLOYEE_SEX,
      CompanyStructHeaderEnum.EMPLOYEE_BIRTH,
      CompanyStructHeaderEnum.EMPLOYEE_EMAIL,
      CompanyStructHeaderEnum.EMPLOYEE_PHONE,
      CompanyStructHeaderEnum.EMPLOYEE_RG,
      CompanyStructHeaderEnum.EMPLOYEE_SOCIAL_NAME,
      CompanyStructHeaderEnum.EMPLOYEE_IS_PCD,
      CompanyStructHeaderEnum.EMPLOYEE_CIDS,
    ],
  },
  [CompanyStructHeaderEnum.EMPLOYEE_NAME]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_NAME,
    checkHandler: checkIsString,
    database: 'name',
    requiredIfOneExist: [CompanyStructHeaderEnum.EMPLOYEE_CPF],
    width: 50,
  },
  [CompanyStructHeaderEnum.EMPLOYEE_ADMISSION]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_ADMISSION,
    checkHandler: checkIsValidDate,
    database: 'admissionDate',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_DEMISSION]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_DEMISSION,
    checkHandler: checkIsValidDate,
    database: 'demissionDate',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_BIRTH]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_BIRTH,
    checkHandler: checkIsValidDate,
    database: 'birthday',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_SEX]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_SEX,
    checkHandler: (value: any) => checkIsEnum(SexTypeEnumTranslateBrToUs(value), SexTypeEnum),
    notes: SexTypeEnumTranslatedNotes,
    database: 'sex',
  },
  [CompanyStructHeaderEnum.ESOCIAL_CODE]: {
    field: CompanyStructHeaderEnum.ESOCIAL_CODE,
    checkHandler: checkIsString,
    database: 'esocialCode',
  },
  [CompanyStructHeaderEnum.LAST_EXAM]: {
    field: CompanyStructHeaderEnum.LAST_EXAM,
    checkHandler: checkIsValidDate,
    database: 'lastExam',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_PHONE]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_PHONE,
    checkHandler: checkIsString,
    database: 'phone',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_EMAIL]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_EMAIL,
    checkHandler: checkIsString,
    width: 40,
    database: 'email',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_SOCIAL_NAME]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_SOCIAL_NAME,
    checkHandler: checkIsString,
    width: 50,
    database: 'socialName',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_RG]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_RG,
    checkHandler: checkIsString,
    database: 'rg',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_IS_PCD]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_IS_PCD,
    checkHandler: checkIsBoolean,
    notes: ['S: Sim', 'N: Não'],
    transform: (v) => (typeof v == 'string' ? Boolean(v) : undefined),
    database: 'isPCD',
  },
  [CompanyStructHeaderEnum.EMPLOYEE_CIDS]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_CIDS,
    checkHandler: checkIsString,
    isArray: true,
    database: 'cids',
  },
  [CompanyStructHeaderEnum.DIRECTORY]: {
    field: CompanyStructHeaderEnum.DIRECTORY,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    database: 'directory',
  },
  [CompanyStructHeaderEnum.MANAGEMENT]: {
    field: CompanyStructHeaderEnum.MANAGEMENT,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    database: 'management',
  },
  [CompanyStructHeaderEnum.SECTOR]: {
    field: CompanyStructHeaderEnum.SECTOR,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    requiredIfOneExist: [CompanyStructHeaderEnum.EMPLOYEE_ADMISSION, CompanyStructHeaderEnum.OFFICE],
    database: 'sector',
  },
  [CompanyStructHeaderEnum.SUB_SECTOR]: {
    field: CompanyStructHeaderEnum.SUB_SECTOR,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    database: 'subSector',
  },
  [CompanyStructHeaderEnum.OFFICE]: {
    field: CompanyStructHeaderEnum.OFFICE,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    requiredIfOneExist: [
      CompanyStructHeaderEnum.EMPLOYEE_ADMISSION,
      CompanyStructHeaderEnum.SUB_OFFICE,
      CompanyStructHeaderEnum.OFFICE_DESCRIPTION,
      CompanyStructHeaderEnum.OFFICE_REAL_DESCRIPTION,
      CompanyStructHeaderEnum.CBO,
    ],
    database: 'office',
  },
  [CompanyStructHeaderEnum.SUB_OFFICE]: {
    field: CompanyStructHeaderEnum.SUB_OFFICE,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    database: 'subOffice',
  },
  [CompanyStructHeaderEnum.OFFICE_DESCRIPTION]: {
    field: CompanyStructHeaderEnum.OFFICE_DESCRIPTION,
    checkHandler: checkIsString,
    width: 80,
    database: 'officeDescription',
  },
  [CompanyStructHeaderEnum.OFFICE_REAL_DESCRIPTION]: {
    field: CompanyStructHeaderEnum.OFFICE_REAL_DESCRIPTION,
    checkHandler: checkIsString,
    width: 80,
    database: 'officeRealDescription',
  },
  [CompanyStructHeaderEnum.CBO]: {
    field: CompanyStructHeaderEnum.CBO,
    checkHandler: checkIsString,
    database: 'cbo',
  },

  [CompanyStructHeaderEnum.GHO]: {
    field: CompanyStructHeaderEnum.GHO,
    checkHandler: checkIsString,
    // fill: ReportFillColorEnum.HEADER_YELLOW,
    width: 30,
    database: 'gho',
  },
  [CompanyStructHeaderEnum.GHO_DESCRIPTION]: {
    field: CompanyStructHeaderEnum.GHO_DESCRIPTION,
    checkHandler: checkIsString,
    width: 80,
    requiredIfOneExist: [CompanyStructHeaderEnum.GHO],
    database: 'ghoDescription',
  },

  // [CompanyStructHeaderEnum.AMB_GENERAL]: {
  //   field: CompanyStructHeaderEnum.AMB_GENERAL,
  //   checkHandler: checkIsString,
  // },
  // [CompanyStructHeaderEnum.AMB_ADM]: {
  //   field: CompanyStructHeaderEnum.AMB_ADM,
  //   checkHandler: checkIsString,
  // },
  // [CompanyStructHeaderEnum.AMB_SUP]: {
  //   field: CompanyStructHeaderEnum.AMB_SUP,
  //   checkHandler: checkIsString,
  // },
  // [CompanyStructHeaderEnum.AMB_OP]: {
  //   field: CompanyStructHeaderEnum.AMB_OP,
  //   checkHandler: checkIsString,
  // },
  // [CompanyStructHeaderEnum.POSTO_DE_TRABALHO]: {
  //   field: CompanyStructHeaderEnum.POSTO_DE_TRABALHO,
  //   checkHandler: checkIsString,
  // },
  // [CompanyStructHeaderEnum.ACTIVITY]: {
  //   field: CompanyStructHeaderEnum.ACTIVITY,
  //   checkHandler: checkIsString,
  // },
  // [CompanyStructHeaderEnum.EQUIPMENT]: {
  //   field: CompanyStructHeaderEnum.EQUIPMENT,
  //   checkHandler: checkIsString,
  // },

  [CompanyStructHeaderEnum.RISK]: {
    field: CompanyStructHeaderEnum.RISK,
    requiredIfOneExist: [
      CompanyStructHeaderEnum.PROB,
      CompanyStructHeaderEnum.GENERATE_SOURCE,
      CompanyStructHeaderEnum.DBA_NR15_Q5,
      CompanyStructHeaderEnum.DBA_LTCAT_Q5,
      CompanyStructHeaderEnum.DBA_LTCAT_Q3,
      CompanyStructHeaderEnum.AREN,
      CompanyStructHeaderEnum.VDVR,
      CompanyStructHeaderEnum.NR15LT,
      CompanyStructHeaderEnum.TWA_ACGH,
      CompanyStructHeaderEnum.STEL,
      CompanyStructHeaderEnum.VMP,
      CompanyStructHeaderEnum.UNIT,
      CompanyStructHeaderEnum.IBTUG,
      CompanyStructHeaderEnum.MW,
      CompanyStructHeaderEnum.IS_ACCLIMATIZED,
      CompanyStructHeaderEnum.CLOTHES_TYPE,
      CompanyStructHeaderEnum.EPI_CA,
      CompanyStructHeaderEnum.EPC,
      CompanyStructHeaderEnum.EPC_OTHERS,
      CompanyStructHeaderEnum.REC,
      CompanyStructHeaderEnum.PROB_REC,
    ],
    checkHandler: checkIsString,
    width: 70,
    notes: ['Nome do Risco cadastrado no sistema'],
    database: 'risk',
  },
  [CompanyStructHeaderEnum.RISK_SEVERITY]: {
    field: CompanyStructHeaderEnum.RISK_SEVERITY,
    checkHandler: checkIsNumber,
    width: 50,
    database: 'riskSeverity',
  },
  [CompanyStructHeaderEnum.RISK_DESCRIPTION]: {
    field: CompanyStructHeaderEnum.RISK_DESCRIPTION,
    checkHandler: checkIsString,
    width: 80,
    database: 'riskDescription',
  },
  [CompanyStructHeaderEnum.RISK_SYMPTOMS]: {
    field: CompanyStructHeaderEnum.RISK_SYMPTOMS,
    checkHandler: checkIsString,
    width: 80,
    database: 'riskSymptoms',
  },
  [CompanyStructHeaderEnum.RISK_TYPE]: {
    field: CompanyStructHeaderEnum.RISK_TYPE,
    checkHandler: (value: any) => checkIsEnum(RiskFactorsEnumTranslateBrToUs(value), RiskFactorsEnum),
    notes: RiskFactorsEnumTranslatedNotes,
    width: 50,
    database: 'riskType',
  },
  [CompanyStructHeaderEnum.PROB]: {
    field: CompanyStructHeaderEnum.PROB,
    checkHandler: (value) => value && checkIsNumber(value),
    database: 'probability',
  },
  [CompanyStructHeaderEnum.GENERATE_SOURCE]: {
    field: CompanyStructHeaderEnum.GENERATE_SOURCE,
    checkHandler: checkIsString,
    isArray: true,
    width: 50,
    database: 'generateSources',
  },

  //* Ruido
  [CompanyStructHeaderEnum.DBA_NR15_Q5]: {
    field: CompanyStructHeaderEnum.DBA_NR15_Q5,
    checkHandler: checkIsNumber,
    database: 'nr15q5',
  },
  [CompanyStructHeaderEnum.DBA_LTCAT_Q5]: {
    field: CompanyStructHeaderEnum.DBA_LTCAT_Q5,
    checkHandler: checkIsNumber,
    database: 'ltcatq5',
  },
  [CompanyStructHeaderEnum.DBA_LTCAT_Q3]: {
    field: CompanyStructHeaderEnum.DBA_LTCAT_Q3,
    checkHandler: checkIsNumber,
    database: 'ltcatq3',
  },

  //* HEAT
  [CompanyStructHeaderEnum.IBTUG]: {
    field: CompanyStructHeaderEnum.IBTUG,
    checkHandler: checkIsNumber,
    requiredIfOneExist: [CompanyStructHeaderEnum.MW, CompanyStructHeaderEnum.IS_ACCLIMATIZED, CompanyStructHeaderEnum.CLOTHES_TYPE],
    database: 'ibtug',
  },
  [CompanyStructHeaderEnum.MW]: {
    field: CompanyStructHeaderEnum.MW,
    checkHandler: checkIsNumber,
    requiredIfOneExist: [CompanyStructHeaderEnum.IBTUG],
    database: 'mw',
  },
  [CompanyStructHeaderEnum.IS_ACCLIMATIZED]: {
    field: CompanyStructHeaderEnum.IS_ACCLIMATIZED,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    requiredIfOneExist: [CompanyStructHeaderEnum.IBTUG],
    database: 'isAcclimatized',
  },
  [CompanyStructHeaderEnum.CLOTHES_TYPE]: {
    field: CompanyStructHeaderEnum.CLOTHES_TYPE,
    checkHandler: (value: any) => checkIsEnum(value, ClothesIBTUG),
    requiredIfOneExist: [CompanyStructHeaderEnum.IBTUG],
    notes: ['Utilizar valores: 0, 0.5, 2, 3, 4, 10, 12'],
    database: 'clothesType',
  },

  //* Vibration
  [CompanyStructHeaderEnum.AREN]: {
    field: CompanyStructHeaderEnum.AREN,
    checkHandler: checkIsNumber,
    database: 'aren',
  },
  [CompanyStructHeaderEnum.VDVR]: {
    field: CompanyStructHeaderEnum.VDVR,
    checkHandler: checkIsNumber,
    database: 'vdvr',
  },

  //* RADIATION
  // [CompanyStructHeaderEnum.DOSE_FB]: {
  //   field: CompanyStructHeaderEnum.DOSE_FB,
  //   checkHandler: checkIsNumber,
  //   database: 'doseFB',
  // },
  // [CompanyStructHeaderEnum.DOSE_FB_PUBLIC]: {
  //   field: CompanyStructHeaderEnum.DOSE_FB_PUBLIC,
  //   checkHandler: checkIsNumber,
  //   database: 'doseFBPublic',
  // },
  // [CompanyStructHeaderEnum.DOSE_EYE]: {
  //   field: CompanyStructHeaderEnum.DOSE_EYE,
  //   checkHandler: checkIsNumber,
  //   database: 'doseEye',
  // },
  // [CompanyStructHeaderEnum.DOSE_EYE_PUBLIC]: {
  //   field: CompanyStructHeaderEnum.DOSE_EYE_PUBLIC,
  //   checkHandler: checkIsNumber,
  //   database: 'doseEyePublic',
  // },
  // [CompanyStructHeaderEnum.DOSE_SKIN]: {
  //   field: CompanyStructHeaderEnum.DOSE_SKIN,
  //   checkHandler: checkIsNumber,
  //   database: 'doseSkin',
  // },
  // [CompanyStructHeaderEnum.DOSE_SKIN_PUBLIC]: {
  //   field: CompanyStructHeaderEnum.DOSE_SKIN_PUBLIC,
  //   checkHandler: checkIsNumber,
  //   database: 'doseSkinPublic',
  // },
  // [CompanyStructHeaderEnum.DOSE_HEAD]: {
  //   field: CompanyStructHeaderEnum.DOSE_HEAD,
  //   checkHandler: checkIsNumber,
  //   database: 'doseHead',
  // },

  //* Chemicals
  [CompanyStructHeaderEnum.NR15LT]: {
    field: CompanyStructHeaderEnum.NR15LT,
    checkHandler: checkIsNumber,
    notes: ['utilizar "T" para indicar TETO'],
    database: 'nr15ltValue',
  },
  [CompanyStructHeaderEnum.TWA_ACGH]: {
    field: CompanyStructHeaderEnum.TWA_ACGH,
    checkHandler: checkIsNumber,
    database: 'twaValue',
  },
  [CompanyStructHeaderEnum.STEL]: {
    field: CompanyStructHeaderEnum.STEL,
    checkHandler: checkIsNumber,
    notes: ['utilizar "C" para indicar "CEILLING"'],
    database: 'stelValue',
  },
  [CompanyStructHeaderEnum.VMP]: {
    field: CompanyStructHeaderEnum.VMP,
    checkHandler: checkIsNumber,
    database: 'vmpValue',
  },
  [CompanyStructHeaderEnum.UNIT]: {
    field: CompanyStructHeaderEnum.UNIT,
    checkHandler: checkIsString,
    width: 30,
    database: 'unit',
  },

  [CompanyStructHeaderEnum.EPI_CA]: {
    field: CompanyStructHeaderEnum.EPI_CA,
    checkHandler: checkIsString,
    isArray: true,
    requiredIfOneExist: [
      CompanyStructHeaderEnum.EPI_EFFICIENTLY,
      CompanyStructHeaderEnum.EPI_EPC,
      CompanyStructHeaderEnum.EPI_LONG_PERIODS,
      CompanyStructHeaderEnum.EPI_VALIDATION,
      CompanyStructHeaderEnum.EPI_TRADE_SIGN,
      CompanyStructHeaderEnum.EPI_SANITATION,
      CompanyStructHeaderEnum.EPI_MAINTENANCE,
      CompanyStructHeaderEnum.EPI_UNSTOPPED,
      CompanyStructHeaderEnum.EPI_TRAINING,
    ],
    database: 'epiCa',
  },
  [CompanyStructHeaderEnum.EPI_EFFICIENTLY]: {
    field: CompanyStructHeaderEnum.EPI_EFFICIENTLY,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiEfficiently',
  },
  [CompanyStructHeaderEnum.EPI_EPC]: {
    field: CompanyStructHeaderEnum.EPI_EPC,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiEpc',
  },
  [CompanyStructHeaderEnum.EPI_LONG_PERIODS]: {
    field: CompanyStructHeaderEnum.EPI_LONG_PERIODS,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiLongPeriods',
  },
  [CompanyStructHeaderEnum.EPI_VALIDATION]: {
    field: CompanyStructHeaderEnum.EPI_VALIDATION,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiValidation',
  },
  [CompanyStructHeaderEnum.EPI_TRADE_SIGN]: {
    field: CompanyStructHeaderEnum.EPI_TRADE_SIGN,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiTradeSign',
  },
  [CompanyStructHeaderEnum.EPI_SANITATION]: {
    field: CompanyStructHeaderEnum.EPI_SANITATION,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiSanitation',
  },
  [CompanyStructHeaderEnum.EPI_MAINTENANCE]: {
    field: CompanyStructHeaderEnum.EPI_MAINTENANCE,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiMaintenance',
  },
  [CompanyStructHeaderEnum.EPI_UNSTOPPED]: {
    field: CompanyStructHeaderEnum.EPI_UNSTOPPED,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiUnstopped',
  },
  [CompanyStructHeaderEnum.EPI_TRAINING]: {
    field: CompanyStructHeaderEnum.EPI_TRAINING,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epiTraining',
  },
  [CompanyStructHeaderEnum.EPC]: {
    field: CompanyStructHeaderEnum.EPC,
    checkHandler: checkIsString,
    requiredIfOneExist: [CompanyStructHeaderEnum.EPC_EFFICIENTLY],
    isArray: true,
    width: 50,
    database: 'epc',
  },
  [CompanyStructHeaderEnum.EPC_EFFICIENTLY]: {
    field: CompanyStructHeaderEnum.EPC_EFFICIENTLY,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
    database: 'epcEfficiently',
  },
  [CompanyStructHeaderEnum.EPC_OTHERS]: {
    field: CompanyStructHeaderEnum.EPC_OTHERS,
    checkHandler: checkIsString,
    isArray: true,
    width: 50,
    database: 'adm',
  },
  [CompanyStructHeaderEnum.REC]: {
    field: CompanyStructHeaderEnum.REC,
    checkHandler: checkIsString,
    isArray: true,
    width: 50,
    database: 'rec',
  },
  [CompanyStructHeaderEnum.PROB_REC]: {
    field: CompanyStructHeaderEnum.PROB_REC,
    checkHandler: (value) => value && checkIsNumber(value),
    database: 'probabilityAfter',
  },
  [CompanyStructHeaderEnum.START_DATE]: {
    field: CompanyStructHeaderEnum.START_DATE,
    checkHandler: checkIsValidDate,
    database: 'startDate',
  },
  [CompanyStructHeaderEnum.END_DATE]: {
    field: CompanyStructHeaderEnum.END_DATE,
    checkHandler: checkIsValidDate,
    database: 'endDate',
  },
};
