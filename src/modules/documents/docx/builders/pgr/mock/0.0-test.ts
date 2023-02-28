import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const testSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: DocumentSectionTypeEnum.CHAPTER,
      text: `test`,
    },
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `test`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
        },
      ],
    },
  ],
};
