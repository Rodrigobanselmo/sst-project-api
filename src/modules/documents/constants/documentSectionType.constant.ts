import { DocumentTypeEnum } from '@prisma/client';
import { DocumentSectionTypeEnum } from '../docx/builders/pgr/types/section.types';

type IDocumentSectionTypeMap = Record<
  DocumentSectionTypeEnum,
  {
    type: DocumentSectionTypeEnum;
    accept: DocumentTypeEnum[];
    label: string;
    active?: boolean;
    text?: string;
    isSection?: boolean;
    isBreakSection?: boolean;
    order?: number;
  }
>;

const primaryOrder = 1;
const secondaryOrder = 2;
const thirdOrder = 3;
const fourthOrder = 4;

export const documentSectionTypeMap: IDocumentSectionTypeMap = {
  [DocumentSectionTypeEnum.CHAPTER]: {
    label: 'PÁGINA DE CAPÍTULO',
    type: DocumentSectionTypeEnum.CHAPTER,
    text: '',
    isBreakSection: true,
    accept: [DocumentTypeEnum.OTHER],
    order: secondaryOrder,
  },
  [DocumentSectionTypeEnum.TOC]: {
    label: 'SÚMARIO',
    type: DocumentSectionTypeEnum.TOC,
    accept: [DocumentTypeEnum.OTHER],
    isBreakSection: true,
    order: thirdOrder,
  },
  [DocumentSectionTypeEnum.COVER]: {
    label: 'CAPA DO DOCUMENTO',
    type: DocumentSectionTypeEnum.COVER,
    accept: [DocumentTypeEnum.OTHER],
    isBreakSection: true,
    order: thirdOrder,
  },
  [DocumentSectionTypeEnum.SECTION]: {
    label: 'SEÇÃO',
    type: DocumentSectionTypeEnum.SECTION,
    isSection: true,
    accept: [DocumentTypeEnum.OTHER],
    order: primaryOrder,
  },
  [DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS]: {
    label: 'Ambientes',
    type: DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS,
    accept: [DocumentTypeEnum.PGR],
    order: fourthOrder,
  },
  [DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION]: {
    label: 'Postos de Trabalho / Atividades / Equipamentos',
    type: DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION,
    accept: [DocumentTypeEnum.PGR],
    order: fourthOrder,
  },
  [DocumentSectionTypeEnum.APR]: {
    label: 'APR',
    type: DocumentSectionTypeEnum.APR,
    accept: [DocumentTypeEnum.PGR],
    order: fourthOrder,
  },
  [DocumentSectionTypeEnum.APR_GROUP]: {
    label: 'APR por Grupo homogênio',
    type: DocumentSectionTypeEnum.APR_GROUP,
    accept: [DocumentTypeEnum.PGR],
    order: fourthOrder,
  },
  [DocumentSectionTypeEnum.ACTION_PLAN]: {
    label: 'Plano de Ação',
    type: DocumentSectionTypeEnum.ACTION_PLAN,
    accept: [DocumentTypeEnum.PGR],
    order: fourthOrder,
  },

  // *PERICULOSIDADE string ---------------------->
  [DocumentSectionTypeEnum.PERICULOSIDADE_ACTIVITIES]: {
    label: 'Avaliação das Atividades Periculosas',
    type: DocumentSectionTypeEnum.PERICULOSIDADE_ACTIVITIES,
    accept: [DocumentTypeEnum.PERICULOSIDADE],
    order: fourthOrder,
  },
};
