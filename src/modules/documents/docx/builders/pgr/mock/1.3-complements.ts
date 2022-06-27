import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

//* document example (TOXILAB) form page 12 to 30

export const complementsSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'DOCUMENTOS COMPLEMENTARES',
        },
        {
          type: PGRSectionChildrenTypeEnum.COMPLEMENTARY_DOCS,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Sistemas de Gestão de SST, HO, MA e Qualidades existentes:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR pode ser atendido por sistemas de gestão, desde que estes cumpram as exigências previstas nesta NR e em dispositivos legais de segurança e saúde no trabalho. **(NR-01 Item 1.5.3.1.2)**.',
        },
        {
          type: PGRSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS,
        },
      ],
    },
  ],
};
