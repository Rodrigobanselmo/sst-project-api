import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const mvvSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_MISSION, VariablesPGREnum.COMPANY_VISION, VariablesPGREnum.COMPANY_VALUES],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'POLÍTICA DE SAÚDE E SEGURANÇA OCUPACIONAL',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**Segue a Política de Qualidade da ??${VariablesPGREnum.COMPANY_SHORT_NAME}??**`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**MISSÃO**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.COMPANY_MISSION}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**VISÃO**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.COMPANY_VISION}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**VALORES**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.COMPANY_VALUES}??`,
        },
      ],
    },
  ],
};
