import { DocumentTypeEnum } from '@prisma/client';
import { DocumentSectionChildrenTypeEnum, ISectionChildrenType } from '../docx/builders/pgr/types/elements.types';

type IDocumentElementTypeMap = Record<
  DocumentSectionChildrenTypeEnum,
  ISectionChildrenType & {
    label: string;
    accept: DocumentTypeEnum[];
    active?: boolean;
    isParagraph?: boolean;
    isBullet?: boolean;
    order?: number;
  }
>;

const primaryOrder = 1;
const secondaryOrder = 2;
const thirdOrder = 3;
const fourthOrder = 4;
const fifthOrder = 5;

export const documentElementTypeMap: IDocumentElementTypeMap = {
  [DocumentSectionChildrenTypeEnum.TITLE]: {
    label: 'Título',
    type: DocumentSectionChildrenTypeEnum.TITLE,
    text: '',
    accept: ['OTHER'],
    order: secondaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.H1]: {
    label: 'H1',
    type: DocumentSectionChildrenTypeEnum.H1,
    text: '',
    accept: ['OTHER'],
    order: secondaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.H2]: {
    label: 'H2',
    type: DocumentSectionChildrenTypeEnum.H2,
    text: '',
    accept: ['OTHER'],
    order: secondaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.H3]: {
    label: 'H3',
    type: DocumentSectionChildrenTypeEnum.H3,
    text: '',
    accept: ['OTHER'],
    order: secondaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.H4]: {
    label: 'H4',
    type: DocumentSectionChildrenTypeEnum.H4,
    text: '',
    accept: ['OTHER'],
    order: secondaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.H5]: {
    label: 'H5',
    type: DocumentSectionChildrenTypeEnum.H5,
    text: '',
    accept: ['OTHER'],
    order: secondaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.H6]: {
    label: 'H6',
    type: DocumentSectionChildrenTypeEnum.H6,
    text: '',
    accept: ['OTHER'],
    order: secondaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.PARAGRAPH]: {
    label: 'Parágrafo',
    type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
    text: '',
    isParagraph: true,
    accept: ['OTHER'],
    order: primaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.IMAGE]: {
    label: 'Imagem',
    type: DocumentSectionChildrenTypeEnum.IMAGE,
    url: null,
    width: 100,
    accept: ['OTHER'],
  },
  [DocumentSectionChildrenTypeEnum.BREAK]: {
    label: 'Quebra de Página',
    type: DocumentSectionChildrenTypeEnum.BREAK,
    isParagraph: true,
    accept: ['OTHER'],
    order: thirdOrder,
  },
  [DocumentSectionChildrenTypeEnum.BULLET]: {
    type: DocumentSectionChildrenTypeEnum.BULLET,
    label: 'Marcador',
    text: '',
    isBullet: true,
    accept: ['OTHER'],
    order: primaryOrder,
  },
  [DocumentSectionChildrenTypeEnum.BULLET_SPACE]: {
    label: 'Marcador (Espaçamento)',
    type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
    text: '',
    accept: ['OTHER'],
    order: thirdOrder,
  },
  [DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL]: {
    label: 'Tabela Controle de Versões',
    type: DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL,
    accept: ['OTHER'],
  },
  [DocumentSectionChildrenTypeEnum.ATTACHMENTS]: {
    label: 'Anexos',
    type: DocumentSectionChildrenTypeEnum.ATTACHMENTS,
    accept: ['OTHER'],
  },
  [DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE]: {
    label: 'Título Tabela ',
    type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
    text: '',
    accept: ['OTHER'],
    order: fourthOrder,
  },
  [DocumentSectionChildrenTypeEnum.LEGEND]: {
    label: 'Legenda Tabela',
    type: DocumentSectionChildrenTypeEnum.LEGEND,
    text: '',
    isParagraph: true,
    accept: ['OTHER'],
    order: fourthOrder,
  },
  [DocumentSectionChildrenTypeEnum.PROFESSIONAL]: {
    label: 'Lista de Profissionais',
    type: DocumentSectionChildrenTypeEnum.PROFESSIONAL,
    accept: ['OTHER'],
    order: fifthOrder,
  },
  [DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES]: {
    label: 'Tabela de Assinatura dos Profissionais',
    type: DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES,
    accept: ['OTHER'],
  },
  [DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE]: {
    label: 'Título Figura',
    type: DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE,
    text: '',
    accept: ['OTHER'],
    order: fourthOrder,
  },

  //*MANY string --------------------->
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY]: {
    label: 'Tabela de Priorização por Cargo',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION]: {
    label: 'Tabela de Priorização por GSE',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_GSE]: {
    label: 'Tabela de Grupos Similares de Exposição',
    type: DocumentSectionChildrenTypeEnum.TABLE_GSE,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS]: {
    label: 'Lista de Documentos Complementares',
    type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE]: {
    label: 'Tabela Relação Cargos vs Riscos',
    type: DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.RISK_TABLE]: {
    label: 'Tabela de Riscos e Perigos',
    type: DocumentSectionChildrenTypeEnum.RISK_TABLE,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: {
    label: 'Lista de Sistemas de Gestão Implementados',
    type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES]: {
    label: 'Tabela de Potenciais Efeitos Adversos à Saúde',
    type: DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES]: {
    label: 'Tabela de Grau de exposição a Saúde',
    type: DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE]: {
    label: 'Tabela de Organograma',
    type: DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES]: {
    label: 'Tabela de Avaliação Quantitativa do Risco Ocupacional',
    type: DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES]: {
    label: 'Tabela de Considerações da Avaliação Quantitativa do Risco Ocupacional',
    type: DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },
  [DocumentSectionChildrenTypeEnum.MATRIX_TABLES]: {
    label: 'Tabela Matriz de Riscos Ocupacionais',
    type: DocumentSectionChildrenTypeEnum.MATRIX_TABLES,
    accept: ['PGR', 'PCSMO', 'PERICULOSIDADE', 'INSALUBRIDADE', 'LTCAT'],
  },

  //*PGR string --------------------->
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM]: {
    label: 'Tabelas dos Ambientes Administrativos',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP]: {
    label: 'Tabelas dos Ambientes Operacionais',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP]: {
    label: 'Tabelas dos Ambientes de Suporte',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL]: {
    label: 'Tabelas dos Ambientes Gerais',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP]: {
    label: 'Tabelas dos Equipamentos',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT]: {
    label: 'Tabelas das Atividades',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION]: {
    label: 'Tabelas dos Postos de Trabalho',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS]: {
    label: 'Lista de Recomendações',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_CONTROL_MEASURES]: {
    label: 'Lista de Mediadas de Controle',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_CONTROL_MEASURES,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_OTHER_CONTROL_MEASURES]: {
    label: 'Lista de Outras Mediadas de Controle',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_OTHER_CONTROL_MEASURES,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_EPI_CONTROL_MEASURES]: {
    label: 'Lista de EPIs',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_EPI_CONTROL_MEASURES,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS]: {
    label: 'Lista dos Riscos de Emergência',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV]: {
    label: 'Tabela de Cargos por Ambiente',
    type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR]: {
    label: 'Tabela de Cargos por Posto / Atividade / Equipamento',
    type: DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV]: {
    label: 'Tabela de Priorização por Ambiente',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR]: {
    label: 'Tabela de Priorização por Posto',
    type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS]: {
    label: 'Lista dos Riscos Físicos',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI]: {
    label: 'Lista dos Riscos Químicos',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO]: {
    label: 'Lista dos Biológicos',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG]: {
    label: 'Lista dos Riscos Ergonômicos',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI]: {
    label: 'Lista dos Riscos de Acidente',
    type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI,
    accept: ['PGR'],
  },

  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE]: {
    label: 'Tabela Dados Quantitativos Ruído',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI]: {
    label: 'Tabela Dados Quantitativos Riscos Químicos',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT]: {
    label: 'Tabela Dados Quantitativos do Calor',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB]: {
    label: 'Tabela Dados Quantitativos Vibração Corpo Inteiro',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL]: {
    label: 'Tabela Dados Quantitativos Vibração Localizada',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD]: {
    label: 'Tabela Dados Quantitativos Radiação',
    type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.MEASURE_IMAGE]: {
    label: 'Imagem: Hierarquia das Medidas de Controle', //!
    type: DocumentSectionChildrenTypeEnum.MEASURE_IMAGE,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.RS_IMAGE]: {
    label: 'Formulario de Acidente de Trabalho (RS)',
    type: DocumentSectionChildrenTypeEnum.RS_IMAGE,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.APR_TABLE]: {
    label: 'Tabela APR',
    type: DocumentSectionChildrenTypeEnum.APR_TABLE,
    active: false,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.PLAN_TABLE]: {
    label: 'Tabela Plano de Ação',
    type: DocumentSectionChildrenTypeEnum.PLAN_TABLE,
    accept: ['PGR'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PCMSO_GHO]: {
    label: 'Tabela Exames vs Riscos por grupo',
    type: DocumentSectionChildrenTypeEnum.TABLE_PCMSO_GHO,
    accept: ['PCSMO'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PCMSO_HIERARCHY]: {
    label: 'Tabela Exames vs Riscos pro hierarquia',
    type: DocumentSectionChildrenTypeEnum.TABLE_PCMSO_HIERARCHY,
    accept: ['PCSMO'],
  },
  [DocumentSectionChildrenTypeEnum.TABLE_PCMSO_HIERARCHY_CONCAT]: {
    label: 'Tabela Exames vs Riscos pro hierarquia mesclada',
    type: DocumentSectionChildrenTypeEnum.TABLE_PCMSO_HIERARCHY_CONCAT,
    accept: ['PCSMO'],
  },
};
