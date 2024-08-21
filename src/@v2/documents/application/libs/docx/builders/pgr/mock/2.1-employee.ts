import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const employeeSection: IDocumentPGRSectionGroup = {
  data: [
    {
      properties: sectionLandscapeProperties,
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'CARACTERIZAÇÃO DA MÃO DE OBRA ((NR-01 ITEM 1.5.7.3.2 ALÍNEA B)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Macroestrutura',
        },
        {
          type: DocumentSectionChildrenTypeEnum.H3,
          text: 'Caracterização Organizacional',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'De acordo com o Organograma – Macroestrutura, a empresa encontra-se organizada através de Setores. Na tabela a seguir são apresentados os setores como as respectivas quantidades de trabalhadores.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Estrutura de Setores com as quantidades respectivas de trabalhadores',
        },
        {
          type: DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Total de trabalhadores: **??${VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL}??**`,
          spacing: { before: 200 },
        },
      ],
    },
  ],
};
