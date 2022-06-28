import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const riskFactorsSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      properties: sectionLandscapeProperties,
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'CARACTERIZAÇÃO DOS FATORES DE RISCO OCUPACIONAL (NR-01 ITEM 1.5.4.3.1 ALÍNEA B)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Relação dos Fatores de Risco e Perigos',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Caracterização Organizacional',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Na Tabela a seguir é apresentada toda estrutura organizacional da TOXILAB onde encontra-se assinalado com um X os fatores de risco presentes em cada departamento da empresa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Estrutura de Setores com as quantidades respectivas de trabalhadores',
        },
        {
          type: PGRSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE,
        },
      ],
    },
  ],
};
