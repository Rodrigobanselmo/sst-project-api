import { ReportFillColorEnum } from '../../../../../report/types/IReportFactory.types';
import { ISheetHeaderList } from '../../../../types/IFileFactory.types';
import { CompanyStructColumnMap, CompanyStructHeaderEnum } from '../company-struct.constants';

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
    ],
    name: 'Identificação Cargo',
  },
  {
    group: [CompanyStructColumnMap[CompanyStructHeaderEnum.GHO]],
    name: 'Identificação GSE',
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
