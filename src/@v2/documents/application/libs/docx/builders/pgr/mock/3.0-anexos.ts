import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const attachmentsSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.CHAPTER,
      text: `ANEXOS`,
    },
    {
      type: DocumentSectionTypeEnum.CHAPTER,
      text: `ANEXO 01 – Inventário de Risco por Função (APR)`,
    },
    {
      type: DocumentSectionTypeEnum.APR,
    },
    {
      type: DocumentSectionTypeEnum.CHAPTER,
      text: `ANEXO 02 – Plano de Ação Detalhado`,
    },
    {
      type: DocumentSectionTypeEnum.SECTION,
      properties: sectionLandscapeProperties,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.PLAN_TABLE,
        },
      ],
    },
  ],
};
