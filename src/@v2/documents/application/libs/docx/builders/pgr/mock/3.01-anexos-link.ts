import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const attachmentsLinkSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.CHAPTER,
      text: `ANEXOS`,
    },
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `Anexos`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: `Anexos`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.ATTACHMENTS,
        },
      ],
    },
  ],
};
