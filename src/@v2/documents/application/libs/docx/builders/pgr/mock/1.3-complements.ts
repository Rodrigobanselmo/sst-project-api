import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const complementsSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'DOCUMENTOS COMPLEMENTARES',
        },
        {
          type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS,
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Sistemas de Gestão de SST, HO, MA e Qualidades existentes:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR pode ser atendido por sistemas de gestão, desde que estes cumpram as exigências previstas nesta NR e em dispositivos legais de segurança e saúde no trabalho. **(NR-01 Item 1.5.3.1.2)**.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS,
        },
      ],
    },
  ],
};