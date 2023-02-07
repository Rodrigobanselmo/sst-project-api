import { ReportColorEnum, ReportFillColorEnum } from './../../../../report/types/IReportFactory.types';
import { ClothesIBTUG, clothesList } from './../../../../../../../shared/constants/maps/ibtu-clothes.map';
import { checkIsValidDate } from './../../../../../../../shared/utils/validators/checkIsValidDate';
import { checkIsBoolean } from '../../../../../../../shared/utils/validators/checkIsBoolean';
import { checkIsNumber } from './../../../../../../../shared/utils/validators/checkIdNumber';
import { IColumnRuleMap, ISheetHeaderList, ISheetRuleMap } from '../../../types/IFileFactory.types';
import { checkIsString } from './../../../../../../../shared/utils/validators/checkIsString';
import { checkIsEnum } from '../../../../../../../shared/utils/validators/checkIsEnum';

export const emptyHierarchy = '!!';

export enum CompanyStructHeaderEnum {
  // COMPANY_SIGLA = 'Sigla (Empresa)',
  WORKSPACE = 'Nome Estabelecimento',
  DIRECTORY = 'Diretoria',
  MANAGEMENT = 'Gerência',
  SECTOR = 'Setor',
  SUB_SECTOR = 'Sub Setor',
  OFFICE = 'Cargo',
  SUB_OFFICE = 'Cargo desenvolvido',
  GHO = 'Grupo Homogênio',
  // AMB_GENERAL = 'Ambiante (Visão Geral)',
  // AMB_ADM = 'Ambiante (Adm)',
  // AMB_SUP = 'Ambiante (Apoio)',
  // AMB_OP = 'Ambiante (Operacional)',
  // POSTO_DE_TRABALHO = 'Posto de Trabalho',
  // ACTIVITY = 'Atividade',
  // EQUIPMENT = 'Equipamento',
  RISK = 'Risco',
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
    fill: ReportFillColorEnum.HEADER_YELLOW,
    width: 30,
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
    requiredIf: [
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
  },
  [CompanyStructHeaderEnum.PROB]: {
    field: CompanyStructHeaderEnum.PROB,
    checkHandler: (value) => value && checkIsNumber(value),
  },
  [CompanyStructHeaderEnum.GENERATE_SOURCE]: {
    field: CompanyStructHeaderEnum.GENERATE_SOURCE,
    checkHandler: checkIsString,
    isArray: true,
    width: 50,
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

  //* HEAT
  [CompanyStructHeaderEnum.IBTUG]: {
    field: CompanyStructHeaderEnum.IBTUG,
    checkHandler: checkIsNumber,
    requiredIf: [CompanyStructHeaderEnum.MW, CompanyStructHeaderEnum.IS_ACCLIMATIZED, CompanyStructHeaderEnum.CLOTHES_TYPE],
  },
  [CompanyStructHeaderEnum.MW]: {
    field: CompanyStructHeaderEnum.MW,
    checkHandler: checkIsNumber,
    requiredIf: [CompanyStructHeaderEnum.IBTUG],
  },
  [CompanyStructHeaderEnum.IS_ACCLIMATIZED]: {
    field: CompanyStructHeaderEnum.IS_ACCLIMATIZED,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    requiredIf: [CompanyStructHeaderEnum.IBTUG],
  },
  [CompanyStructHeaderEnum.CLOTHES_TYPE]: {
    field: CompanyStructHeaderEnum.CLOTHES_TYPE,
    checkHandler: (value: any) => checkIsEnum(value, ClothesIBTUG),
    requiredIf: [CompanyStructHeaderEnum.IBTUG],
    notes: ['Utilizar valores: 0, 0.5, 2, 3, 4, 10, 12'],
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
    width: 30,
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
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_EPC]: {
    field: CompanyStructHeaderEnum.EPI_EPC,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_LONG_PERIODS]: {
    field: CompanyStructHeaderEnum.EPI_LONG_PERIODS,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_VALIDATION]: {
    field: CompanyStructHeaderEnum.EPI_VALIDATION,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_TRADE_SIGN]: {
    field: CompanyStructHeaderEnum.EPI_TRADE_SIGN,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_SANITATION]: {
    field: CompanyStructHeaderEnum.EPI_SANITATION,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_MAINTENANCE]: {
    field: CompanyStructHeaderEnum.EPI_MAINTENANCE,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_UNSTOPPED]: {
    field: CompanyStructHeaderEnum.EPI_UNSTOPPED,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPI_TRAINING]: {
    field: CompanyStructHeaderEnum.EPI_TRAINING,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPC]: {
    field: CompanyStructHeaderEnum.EPC,
    checkHandler: checkIsString,
    requiredIf: [CompanyStructHeaderEnum.EPC_EFFICIENTLY],
    isArray: true,
    width: 50,
  },
  [CompanyStructHeaderEnum.EPC_EFFICIENTLY]: {
    field: CompanyStructHeaderEnum.EPC_EFFICIENTLY,
    checkHandler: checkIsBoolean,
    transform: (v) => Boolean(v),
    notes: ['S: Sim', 'N: Não'],
  },
  [CompanyStructHeaderEnum.EPC_OTHERS]: {
    field: CompanyStructHeaderEnum.EPC_OTHERS,
    checkHandler: checkIsString,
    isArray: true,
    width: 50,
  },
  [CompanyStructHeaderEnum.REC]: {
    field: CompanyStructHeaderEnum.REC,
    checkHandler: checkIsString,
    isArray: true,
    width: 50,
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

export const CompanyStructColumnList: ISheetHeaderList = [
  { group: [CompanyStructColumnMap[CompanyStructHeaderEnum.WORKSPACE]], name: 'Identifição Estabelecimento' },
  {
    group: [
      CompanyStructColumnMap[CompanyStructHeaderEnum.DIRECTORY],
      CompanyStructColumnMap[CompanyStructHeaderEnum.MANAGEMENT],
      CompanyStructColumnMap[CompanyStructHeaderEnum.SECTOR],
      CompanyStructColumnMap[CompanyStructHeaderEnum.SUB_SECTOR],
      CompanyStructColumnMap[CompanyStructHeaderEnum.OFFICE],
      CompanyStructColumnMap[CompanyStructHeaderEnum.SUB_OFFICE],
      CompanyStructColumnMap[CompanyStructHeaderEnum.GHO],
    ],
    name: 'Identificação Cargo ou GSE Afetado',
  },
  {
    group: [
      CompanyStructColumnMap[CompanyStructHeaderEnum.RISK],
      CompanyStructColumnMap[CompanyStructHeaderEnum.PROB],
      CompanyStructColumnMap[CompanyStructHeaderEnum.GENERATE_SOURCE],
    ],
    name: 'Risco Ocupacional',
  },
  {
    group: [
      [
        CompanyStructColumnMap[CompanyStructHeaderEnum.DBA_NR15_Q5],
        CompanyStructColumnMap[CompanyStructHeaderEnum.DBA_LTCAT_Q5],
        CompanyStructColumnMap[CompanyStructHeaderEnum.DBA_LTCAT_Q3],
      ],

      [
        CompanyStructColumnMap[CompanyStructHeaderEnum.IBTUG],
        CompanyStructColumnMap[CompanyStructHeaderEnum.MW],
        CompanyStructColumnMap[CompanyStructHeaderEnum.IS_ACCLIMATIZED],
        CompanyStructColumnMap[CompanyStructHeaderEnum.CLOTHES_TYPE],
      ],

      [CompanyStructColumnMap[CompanyStructHeaderEnum.AREN], CompanyStructColumnMap[CompanyStructHeaderEnum.VDVR]],

      [
        CompanyStructColumnMap[CompanyStructHeaderEnum.NR15LT],
        CompanyStructColumnMap[CompanyStructHeaderEnum.TWA_ACGH],
        CompanyStructColumnMap[CompanyStructHeaderEnum.STEL],
        CompanyStructColumnMap[CompanyStructHeaderEnum.VMP],
        CompanyStructColumnMap[CompanyStructHeaderEnum.UNIT],
      ],
    ],
    name: 'Valores Quantitativos do Risco',
    fillColors: [ReportFillColorEnum.HEADER_YELLOW, ReportFillColorEnum.HEADER_RED],
  },
  {
    group: [
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_CA],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_EFFICIENTLY],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_EPC],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_LONG_PERIODS],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_VALIDATION],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_TRADE_SIGN],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_SANITATION],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_MAINTENANCE],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_UNSTOPPED],
      CompanyStructColumnMap[CompanyStructHeaderEnum.EPI_TRAINING],
    ],
    name: 'Medidas de Controle (EPI)',
  },
  {
    group: [CompanyStructColumnMap[CompanyStructHeaderEnum.EPC], CompanyStructColumnMap[CompanyStructHeaderEnum.EPC_EFFICIENTLY]],
    name: 'Medidas de Controle de Engenharia (EPC)',
  },
  {
    group: [CompanyStructColumnMap[CompanyStructHeaderEnum.EPC_OTHERS]],
    name: 'Medidas de Controle Admnistrativa',
  },
  {
    group: [CompanyStructColumnMap[CompanyStructHeaderEnum.REC], CompanyStructColumnMap[CompanyStructHeaderEnum.PROB_REC]],
    name: 'Recomendações',
  },
  {
    group: [CompanyStructColumnMap[CompanyStructHeaderEnum.START_DATE], CompanyStructColumnMap[CompanyStructHeaderEnum.END_DATE]],
    name: 'Periódo de Exposição ao Risco',
    fillColors: [ReportFillColorEnum.HEADER_RED],
  },
];
