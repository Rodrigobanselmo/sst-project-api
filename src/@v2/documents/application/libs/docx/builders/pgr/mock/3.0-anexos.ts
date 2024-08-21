import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

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
