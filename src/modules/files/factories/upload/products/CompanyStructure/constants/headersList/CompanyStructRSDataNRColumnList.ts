import { ISheetHeaderList } from '../../../../types/IFileFactory.types';
import { CompanyStructRSDataNRColumnMap, CompanyStructRSDataNRHeaderEnum } from '../company-struct-rsdata-nr.constants';

export const CompanyStructRSDataNRColumnList: ISheetHeaderList = [
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.TIPO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.UNIDADE],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CNPJ],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CODIGO_SETOR],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.SETOR],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CODIGO_SETOR_D],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.SETOR_D],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CODIGO_GHE],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.GHE],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CODIGO_CARDO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CARGO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CODIGO_CARGO_D],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CARGO_D],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CODIGO_PT],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.POSICAO],
    ],
    name: 'Identifição',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INICIO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.FIM],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.ANEXO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.TECNICA],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EXPOSICAO],
    ],
    name: 'Identificação do RISCO',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.MEDIÇAO_PORTARIA],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.MEDIÇAO_INSS],
    ],
    name: 'Anexo 1 - Limites de Tolerância para Ruído Contínuo ou Intermitente	',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INTENSIDADE_RUIDO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.TIPO_LEITURA],
    ],
    name: 'Anexo 2 - Limites de Tolerância para Ruídos de Impacto	',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.RESULTADO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.TIPO_ATIVIDADE],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.KCAL],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.REGIME],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.LOCAL],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.LIMITE_IBUTG],
    ],
    name: 'Anexo 3 - Limites de Tolerância para Exposição ao Calor',
  },
  {
    group: [CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INTENSIDADE_RAD]],
    name: 'Anexo 5 - Rad. Ionizantes',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.TIPO_VIBRACAO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CORPO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INTENSIDADE_AREN],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INTENSIDADE_VDVR],
    ],
    name: 'Anexo 8 -  Vibrações			',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.LIMITE_FRIO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INTENSIDADE_FRIO],
    ],
    name: 'Anexo 9  - Frio	',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.AGENTE_QUI],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INTENSIDADE_QUI],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.UNIDADE_MEDIDA],
    ],
    name: 'Anexo 11 - Agentes Químicos Cuja Insalubridade é Caracterizada por Limite de Tolerância  e Inspeção no Local de Trabalho	',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.AGENTE_POEIRA],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.INTENSIDADE_POEIRA],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.UNIDADE_POEIRA],
    ],
    name: 'Anexo 12 - Limites de Tolerância para Poeiras Minerais		',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.AGENTE_QUI_ANEXO_13],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.MANIPULAÇAO_ANEXO_13],
    ],
    name: 'Anexo 13 - Agentes Químicos	',
  },
  {
    group: [CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.AGENTE_RESTO]],
    name: 'Anexo 7 / Anexo 14 / Nr16 Anexo 1 / Nr16 Anexo2 / Nr16 Anexo 3 / Nr16 Anexo 5/ Acidentes/ Ergonômicos',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.FATOR_ELET_RAD],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.TAREFA_ELET_RAD],
    ],
    name: 'Eletricidade / Radiações Ionizantes	',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CONSTAR_EM],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CONSIDERAR_PCMSO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.NAO_CONSIDERAR_COMPLEMENTARES],
    ],
    name: 'Geral		',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CA],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_EFICAZ],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_TREINAMENTO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_REGISTRO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_1],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_2],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_3],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_4],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_5],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_6],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.EPI_7],
    ],
    name: 'EPI											',
  },
  {
    group: [CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.AGENTE_EQUIVALENTE]],
    name: 'Anexo IV',
  },
  {
    group: [
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.FONTE_GERADORA],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.MEIO_PROP],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.COMPROMETIMENTO],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.POSSIVEIS_DANOS],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.MEDIDAS_CONTROLE],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.VIAS_ABS],
      CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.RECOMENDACOES],
    ],
    name: 'Considerações						',
  },
  {
    group: [CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.OBSERVACOES]],
    name: 'Complementares',
  },
  {
    group: [CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.ETAPA]],
    name: '',
  },
  {
    group: [CompanyStructRSDataNRColumnMap[CompanyStructRSDataNRHeaderEnum.CODIGO]],
    name: 'Integração',
  },
];
