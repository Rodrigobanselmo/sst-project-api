import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const mvvSection: IDocumentPGRSectionGroup = {

  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_MISSION, VariablesPGREnum.COMPANY_VISION, VariablesPGREnum.COMPANY_VALUES],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'POLÍTICA DE SAÚDE E SEGURANÇA OCUPACIONAL',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `**Segue a Política de Qualidade da ??${VariablesPGREnum.COMPANY_SHORT_NAME}??**`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**MISSÃO**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.COMPANY_MISSION}??`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**VISÃO**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.COMPANY_VISION}??`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**VALORES**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.COMPANY_VALUES}??`,
        },
      ],
    },
  ],
};
