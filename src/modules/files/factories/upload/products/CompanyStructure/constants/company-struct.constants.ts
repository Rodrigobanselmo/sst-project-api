import { checkIsValidDate } from './../../../../../../../shared/utils/validators/checkIsValidDate';
import { checkIsXTrue } from './../../../../../../../shared/utils/validators/checkIsXTrue';
import { checkIsNumber } from './../../../../../../../shared/utils/validators/checkIdNumber';
import { IColumnRuleMap, ISheetRuleMap } from '../../../types/IFileFactory.types';
import { checkIsString } from './../../../../../../../shared/utils/validators/checkIsString';

export enum CompanyStructHeaderEnum {
  COMPANY_SIGLA = 'Sigla (Empresa)',
  WORKSPACE = 'Nome Estabelecimento',
  DIRECTORY = 'Diretoria',
  MANAGEMENT = 'Gerência',
  SECTOR = 'Setor',
  SUB_SECTOR = 'Sub Setor',
  OFFICE = 'Cargo',
  SUB_OFFICE = 'Cargo desenvolvido',
  GHO = 'Grupo Homogênio',
  AMB_GENERAL = 'Ambiante (Visão Geral)',
  AMB_ADM = 'Ambiante (Adm)',
  AMB_SUP = 'Ambiante (Apoio)',
  AMB_OP = 'Ambiante (Operacional)',
  POSTO_DE_TRABALHO = 'Posto de Trabalho',
  ACTIVITY = 'Atividade',
  EQUIPMENT = 'Equipamento',
  RISK = 'Risco',
  PROB = 'Probabilidade',
  SOURCE = 'Fonte Geradora',

  AREN = 'aren',
  VDVR = 'vdvr',

  DBA_NR15_Q5 = 'db (A)',
  DBA_LTCAT_Q5 = 'LTCAT db (A) Q5',
  DBA_LTCAT_Q3 = 'LTCAT db (A) Q3',

  NR15LT = 'NR15 / CMPT',
  TWA_ACGH = 'ACGIH TWA',
  STEL = 'ACGIH STEL',
  VMP = 'vmp',
  UNIT = 'unidade',

  IBTU = 'IBTUG (*C)',
  MW = 'MW',
  IS_ACCLIMATIZED = 'É ambiente aclimatizado?',
  CLOTHES_TYPE = 'Valor do tipo de ropa (IBTUG)',

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
  [CompanyStructHeaderEnum.COMPANY_SIGLA]: {
    field: CompanyStructHeaderEnum.COMPANY_SIGLA,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.WORKSPACE]: {
    field: CompanyStructHeaderEnum.WORKSPACE,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.DIRECTORY]: {
    field: CompanyStructHeaderEnum.DIRECTORY,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.MANAGEMENT]: {
    field: CompanyStructHeaderEnum.MANAGEMENT,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.SECTOR]: {
    field: CompanyStructHeaderEnum.SECTOR,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.SUB_SECTOR]: {
    field: CompanyStructHeaderEnum.SUB_SECTOR,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.OFFICE]: {
    field: CompanyStructHeaderEnum.OFFICE,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.SUB_OFFICE]: {
    field: CompanyStructHeaderEnum.SUB_OFFICE,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.GHO]: {
    field: CompanyStructHeaderEnum.GHO,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.AMB_GENERAL]: {
    field: CompanyStructHeaderEnum.AMB_GENERAL,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.AMB_ADM]: {
    field: CompanyStructHeaderEnum.AMB_ADM,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.AMB_SUP]: {
    field: CompanyStructHeaderEnum.AMB_SUP,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.AMB_OP]: {
    field: CompanyStructHeaderEnum.AMB_OP,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.POSTO_DE_TRABALHO]: {
    field: CompanyStructHeaderEnum.POSTO_DE_TRABALHO,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.ACTIVITY]: {
    field: CompanyStructHeaderEnum.ACTIVITY,
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.EQUIPMENT]: {
    field: CompanyStructHeaderEnum.EQUIPMENT,
    checkHandler: checkIsString,
  },

  [CompanyStructHeaderEnum.RISK]: {
    field: CompanyStructHeaderEnum.RISK,
    requiredIf: [
      CompanyStructHeaderEnum.PROB,
      CompanyStructHeaderEnum.SOURCE,
      CompanyStructHeaderEnum.DBA_NR15_Q5,
      CompanyStructHeaderEnum.AREN,
      CompanyStructHeaderEnum.VDVR,
      CompanyStructHeaderEnum.TWA_ACGH,
      CompanyStructHeaderEnum.EPI_CA,
      CompanyStructHeaderEnum.EPC,
      CompanyStructHeaderEnum.EPC_OTHERS,
      CompanyStructHeaderEnum.REC,
      CompanyStructHeaderEnum.PROB_REC,
    ],
    checkHandler: checkIsString,
  },
  [CompanyStructHeaderEnum.PROB]: {
    field: CompanyStructHeaderEnum.PROB,
    checkHandler: (value) => value && checkIsNumber(value),
  },
  [CompanyStructHeaderEnum.SOURCE]: {
    field: CompanyStructHeaderEnum.SOURCE,
    checkHandler: checkIsString,
    isArray: true,
  },

  //* Vibration
  [CompanyStructHeaderEnum.AREN]: {
    field: CompanyStructHeaderEnum.AREN,
    checkHandler: checkIsNumber,
  },
  [CompanyStructHeaderEnum.VDVR]: {
    field: CompanyStructHeaderEnum.VDVR,
    checkHandler: checkIsNumber,
  },

  //* Ruido
  [CompanyStructHeaderEnum.DBA_NR15_Q5]: {
    field: CompanyStructHeaderEnum.DBA_NR15_Q5,
    checkHandler: checkIsNumber,
  },
  [CompanyStructHeaderEnum.DBA_LTCAT_Q5]: {
    field: CompanyStructHeaderEnum.DBA_LTCAT_Q5,
    checkHandler: checkIsNumber,
  },
  [CompanyStructHeaderEnum.DBA_LTCAT_Q3]: {
    field: CompanyStructHeaderEnum.DBA_LTCAT_Q3,
    checkHandler: checkIsNumber,
  },

  //* Chemicals
  [CompanyStructHeaderEnum.NR15LT]: {
    field: CompanyStructHeaderEnum.NR15LT,
    checkHandler: checkIsNumber,
    notes: ['utilizar "T" para indicar TETO'],
  },
  [CompanyStructHeaderEnum.TWA_ACGH]: {
    field: CompanyStructHeaderEnum.TWA_ACGH,
    checkHandler: checkIsNumber,
  },
  [CompanyStructHeaderEnum.STEL]: {
    field: CompanyStructHeaderEnum.STEL,
    checkHandler: checkIsNumber,
    notes: ['utilizar "C" para indicar "CEILLING"'],
  },
  [CompanyStructHeaderEnum.VMP]: {
    field: CompanyStructHeaderEnum.VMP,
    checkHandler: checkIsNumber,
  },
  [CompanyStructHeaderEnum.UNIT]: {
    field: CompanyStructHeaderEnum.UNIT,
    checkHandler: checkIsString,
  },

  //* HEAT
  [CompanyStructHeaderEnum.IBTU]: {
    field: CompanyStructHeaderEnum.IBTU,
    checkHandler: checkIsNumber,
  },
  [CompanyStructHeaderEnum.MW]: {
    field: CompanyStructHeaderEnum.MW,
    checkHandler: checkIsNumber,
  },
  [CompanyStructHeaderEnum.IS_ACCLIMATIZED]: {
    field: CompanyStructHeaderEnum.IS_ACCLIMATIZED,
    checkHandler: checkIsXTrue,
  },
  [CompanyStructHeaderEnum.CLOTHES_TYPE]: {
    field: CompanyStructHeaderEnum.CLOTHES_TYPE,
    checkHandler: checkIsNumber,
  },

  [CompanyStructHeaderEnum.EPI_CA]: {
    field: CompanyStructHeaderEnum.EPI_CA,
    checkHandler: checkIsString,
    isArray: true,
    requiredIf: [
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
  },
  [CompanyStructHeaderEnum.EPI_EFFICIENTLY]: {
    field: CompanyStructHeaderEnum.EPI_EFFICIENTLY,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_EPC]: {
    field: CompanyStructHeaderEnum.EPI_EPC,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_LONG_PERIODS]: {
    field: CompanyStructHeaderEnum.EPI_LONG_PERIODS,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_VALIDATION]: {
    field: CompanyStructHeaderEnum.EPI_VALIDATION,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_TRADE_SIGN]: {
    field: CompanyStructHeaderEnum.EPI_TRADE_SIGN,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_SANITATION]: {
    field: CompanyStructHeaderEnum.EPI_SANITATION,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_MAINTENANCE]: {
    field: CompanyStructHeaderEnum.EPI_MAINTENANCE,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_UNSTOPPED]: {
    field: CompanyStructHeaderEnum.EPI_UNSTOPPED,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPI_TRAINING]: {
    field: CompanyStructHeaderEnum.EPI_TRAINING,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPC]: {
    field: CompanyStructHeaderEnum.EPC,
    checkHandler: checkIsString,
    requiredIf: [CompanyStructHeaderEnum.EPC_EFFICIENTLY],
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPC_EFFICIENTLY]: {
    field: CompanyStructHeaderEnum.EPC_EFFICIENTLY,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.EPC_OTHERS]: {
    field: CompanyStructHeaderEnum.EPC_OTHERS,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.REC]: {
    field: CompanyStructHeaderEnum.REC,
    checkHandler: checkIsString,
    isArray: true,
  },
  [CompanyStructHeaderEnum.PROB_REC]: {
    field: CompanyStructHeaderEnum.PROB_REC,
    checkHandler: (value) => value && checkIsNumber(value),
  },
  [CompanyStructHeaderEnum.START_DATE]: {
    field: CompanyStructHeaderEnum.START_DATE,
    checkHandler: checkIsValidDate,
  },
  [CompanyStructHeaderEnum.END_DATE]: {
    field: CompanyStructHeaderEnum.END_DATE,
    checkHandler: checkIsValidDate,
  },
};
