import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

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
