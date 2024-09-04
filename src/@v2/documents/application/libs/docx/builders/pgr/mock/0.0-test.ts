import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const testSection: IDocumentPGRSectionGroup = {
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
