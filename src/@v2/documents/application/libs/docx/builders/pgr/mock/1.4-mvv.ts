import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const mvvSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      removeWithSomeEmptyVars: [
        VariablesPGREnum.COMPANY_MISSION,
        VariablesPGREnum.COMPANY_VISION,
        VariablesPGREnum.COMPANY_VALUES,
      ],
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
