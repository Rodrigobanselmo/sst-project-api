import { DocumentTypeEnum } from '@prisma/client';
import { DocumentSectionTypeEnum } from '../docx/builders/pgr/types/section.types';

type IDocumentSectionTypeMap = Record<
  DocumentSectionTypeEnum,
  { type: DocumentSectionTypeEnum; accept: DocumentTypeEnum[]; label: string; active?: boolean; text?: string; isSection?: boolean; isBreakSection?: boolean }
>;

export const documentSectionTypeMap: IDocumentSectionTypeMap = {
  [DocumentSectionTypeEnum.CHAPTER]: {
    label: 'PÄGINA DE CAPÍTULO',
    type: DocumentSectionTypeEnum.CHAPTER,
    text: '',
    isBreakSection: true,
    accept: [DocumentTypeEnum.OTHER],
  },
  [DocumentSectionTypeEnum.TOC]: {
    label: 'SÚMARIO',
    type: DocumentSectionTypeEnum.TOC,
    accept: [DocumentTypeEnum.OTHER],
    isBreakSection: true,
  },
  [DocumentSectionTypeEnum.COVER]: {
    label: 'CAPA DO DOCUMENTO',
    type: DocumentSectionTypeEnum.COVER,
    accept: [DocumentTypeEnum.OTHER],
    isBreakSection: true,
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
