import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const employeeSection: IDocumentPGRSectionGroup = {
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
          text: 'CARACTERIZAÇÃO DA MÃO DE OBRA ((NR-01 ITEM 1.5.7.3.2 ALÍNEA B)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Macroestrutura',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Caracterização Organizacional',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'De acordo com o Organograma – Macroestrutura, a empresa encontra-se organizada através de Seto- res. Na tabela a seguir são apresentados os setores como as respectivas quantidades de trabalhadores.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Tabela 18: Estrutura de Setores com as quantidades respectivas de trabalhadores',
        },
        {
          type: PGRSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: '2.2.	Inventário de Risco (APR)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'De acordo cNo Anexo 01 deste documento, encontram-se as planilhas com o resumo das entrevistas realizadas com os trabalhadores que sumarizam as características de exposição, constando a Função; Descrição da fun-ção e Atividades/Fatores de Risco e Perigos resumindo as principais informações do Inventário de Risco, incluindo a Severidade, Probabilidade e principalmente o Risco Ocupacional. om o Organograma – Macroestrutura, a empresa encontra-se organizada através de Seto- res. Na tabela a seguir são apresentados os setores como as respectivas quantidades de trabalhadores.',
        },
      ],
    },
  ],
};
