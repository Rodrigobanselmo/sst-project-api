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
  [DocumentSectionTypeEnum.APR]: {
    label: '',
    type: DocumentSectionTypeEnum.APR,
    active: false,
    accept: [DocumentTypeEnum.PGR],
    order: fourthOrder,
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

  //*PGR string --------------------->
};
