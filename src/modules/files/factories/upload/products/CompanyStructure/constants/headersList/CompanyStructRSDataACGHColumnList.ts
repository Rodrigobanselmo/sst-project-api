import { ISheetHeaderList } from '../../../../types/IFileFactory.types';
import {
  CompanyStructRSDataACGHColumnMap,
  CompanyStructRSDataACGHHeaderEnum,
} from '../company-struct-rsdata-acgh.constants';

export const CompanyStructRSDataACGHColumnList: ISheetHeaderList = [
  {
    group: [
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.TIPO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.UNIDADE],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CNPJ],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CODIGO_SETOR],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.SETOR],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CODIGO_SETOR_D],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.SETOR_D],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CODIGO_GHE],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.GHE],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CODIGO_CARDO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CARGO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CODIGO_CARGO_D],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CARGO_D],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CODIGO_PT],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.POSICAO],
    ],
    name: 'Identifição',
  },
  {
    group: [
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.INICIO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.FIM],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.TECNICA],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.EXPOSICAO],
    ],
    name: 'Identificação do RISCO',
  },
  {
    group: [
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.AGENTE],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.TWA],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.STEL],
    ],
    name: 'ACGH',
  },
  {
    group: [
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CONSIDERAR_PCMSO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.NAO_CONSIDERAR_COMPLEMENTARES],
    ],
    name: 'Geral		',
  },
  {
    group: [
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.EPI],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CA],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.EPI_EFETIVO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.TREINAMENTO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.REGISTRO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.EPI_ALL],
    ],
    name: 'EPI											',
  },
  {
    group: [
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.FONTE_GERADORA],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.MEIO_PROP],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.COMPROMETIMENTO],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.POSSIVEIS_DANOS],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.MEDIDAS_CONTROLE],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.RECOMENDACOES],
    ],
    name: 'Considerações						',
  },
  {
    group: [
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.OBSERVACOES],
      CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.ETAPA],
    ],
    name: 'Complementares',
  },
  {
    group: [CompanyStructRSDataACGHColumnMap[CompanyStructRSDataACGHHeaderEnum.CODIGO]],
    name: 'Integração',
  },
];
