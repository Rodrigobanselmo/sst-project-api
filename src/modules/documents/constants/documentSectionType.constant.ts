import { DocumentTypeEnum } from '@prisma/client';
import { DocumentSectionTypeEnum } from '../docx/builders/pgr/types/section.types';

type IDocumentSectionTypeMap = Record<
  DocumentSectionTypeEnum,
  { type: DocumentSectionTypeEnum; accept: DocumentTypeEnum[]; label: string; active?: boolean; text?: string; isSection?: boolean }
>;

export const documentSectionTypeMap: IDocumentSectionTypeMap = {
  [DocumentSectionTypeEnum.CHAPTER]: {
    label: 'CAPÍTULO',
    type: DocumentSectionTypeEnum.CHAPTER,
    text: '',
    accept: [DocumentTypeEnum.OTHER],
  },
  [DocumentSectionTypeEnum.TOC]: {
    label: 'SÚMARIO',
    type: DocumentSectionTypeEnum.TOC,
    accept: [DocumentTypeEnum.OTHER],
  },
  [DocumentSectionTypeEnum.COVER]: {
    label: 'CAPA',
    type: DocumentSectionTypeEnum.COVER,
    accept: [DocumentTypeEnum.OTHER],
  },
  [DocumentSectionTypeEnum.SECTION]: {
    label: 'SEÇÃO',
    type: DocumentSectionTypeEnum.SECTION,
    isSection: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [DocumentSectionTypeEnum.APR]: {
    label: '',
    type: DocumentSectionTypeEnum.APR,
    active: false,
    accept: [DocumentTypeEnum.PGR],
  },
  [DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS]: {
    label: 'Ambientes',
    type: DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS,
    accept: [DocumentTypeEnum.PGR],
  },
  [DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION]: {
    label: 'Postos de Trabalho / Atividades / Equipamentos',
    type: DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION,
    accept: [DocumentTypeEnum.PGR],
  },

  //*PGR string --------------------->
};
