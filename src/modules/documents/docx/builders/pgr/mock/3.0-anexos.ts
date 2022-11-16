import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const attachmentsSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.CHAPTER,
      text: `ANEXOS`,
    },
    {
      type: PGRSectionTypeEnum.CHAPTER,
      text: `ANEXO 01 – Inventário de Risco por Função (APR)`,
    },
    {
      type: PGRSectionTypeEnum.APR,
    },
    {
      type: PGRSectionTypeEnum.CHAPTER,
      text: `ANEXO 02 – Plano de Ação Detalhado`,
    },
    {
      type: PGRSectionTypeEnum.SECTION,
      properties: sectionLandscapeProperties,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.PLAN_TABLE,
        },
      ],
    },
  ],
};
