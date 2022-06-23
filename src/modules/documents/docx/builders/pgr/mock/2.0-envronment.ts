import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const environmentSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.CHAPTER,
      text: `??${VariablesPGREnum.CHAPTER_2}??`,
    },
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.TITLE,
          text: `??${VariablesPGREnum.CHAPTER_2}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'CARACTERIZAÇÃO DO AMBIENTE DE TRABALHO (NR-01 ITEM 1.5.7.3.2 ALÍNEA A)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A caracterização dos ambientes de trabalho é uma ferramenta importante na graduação do risco de exposição dos empregados, pois fornece uma visão geral dos processos, dos riscos presentes e das fontes geradoras desses riscos. Através da análise de fluxogramas, layouts, diagramas e da própria descrição de cada processo de trabalho, podemos identificar oportunidades de implantação de medidas de controle capazes de minimizar ou até mesmo eliminar os riscos de exposição para os trabalhadores`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A seguir é apresentada uma relação dos diversos ambientes que compreendem a **??${VariablesPGREnum.COMPANY_SHORT_NAME}??** com suas respectivas atribuições e descrição dos seus respectivos processos produtivos.`,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Ambientes Administrativos',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Nos ambientes administrativos são executadas atividades diversas pouco relacionadas com riscos físicos, químicos e biológicos, mas é possível encontrar alguns fatores de riscos ergonômicos e até mesmo de acidentes, no entanto de baixa severidade.',
        },
        {
          type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS,
        },
      ],
    },
  ],
};
