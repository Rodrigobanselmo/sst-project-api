import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

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
