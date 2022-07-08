import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const characterizationSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
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
          text: 'CARACTERIZAÇÃO DA MÃO DE OBRA',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A seguir, serão demonstrados elementos coletados em campo, que justificaram as classificações quanto ao Grau de Risco na APR/APP`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Posto de Trabalho:** TEXTO ALEX',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Atividades:** ...',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Equipamentos:** ...',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A seguir é apresentada à caracterização da mão de obra que compreende a empresa **??${VariablesPGREnum.COMPANY_SHORT_NAME}??** com sua respectiva descrição e caracteristicas.`,
        },
      ],
    },
    {
      type: PGRSectionTypeEnum.ITERABLE_CHARACTERIZATION,
    },
  ],
};

// export const characterizationSection: IDocumentPGRSectionGroup = {
//   footer: true,
//   header: true,
//   data: [
//     {
//       type: PGRSectionTypeEnum.SECTION,
//       footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
//       children: [
//         {
//           type: PGRSectionChildrenTypeEnum.H2,
//           text: 'CARACTERIZAÇÃO DA MÃO DE OBRA',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.PARAGRAPH,
//           text: `A seguir, serão demonstrados elementos coletados em campo, que justificaram as classificações quanto ao Grau de Risco na APP`,
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.H3,
//           text: 'Posto de Trabalho',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.PARAGRAPH,
//           text: 'FAZER TESTO EXPLICANDO O QUE SÃO CONSIDERADOS',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION,
//           removeWithSomeEmptyVars: [
//             VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK,
//           ],
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.BREAK,
//           removeWithSomeEmptyVars: [
//             VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK,
//           ],
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.H2,
//           text: 'Atividades',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.PARAGRAPH,
//           text: 'FAZER TESTO EXPLICANDO O QUE SÃO CONSIDERADOS',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT,
//           removeWithSomeEmptyVars: [
//             VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT,
//           ],
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.BREAK,
//           removeWithSomeEmptyVars: [
//             VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT,
//           ],
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.H2,
//           text: 'Equipamentos',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.PARAGRAPH,
//           text: 'FAZER TESTO EXPLICANDO O QUE SÃO CONSIDERADOS',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP,
//           removeWithSomeEmptyVars: [
//             VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP,
//           ],
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.H2,
//           text: 'Inventário de Risco (APR)',
//         },
//         {
//           type: PGRSectionChildrenTypeEnum.PARAGRAPH,
//           text: 'No Anexo 01 deste documento, encontram-se as planilhas com o resumo das entrevistas realizadas com os trabalhadores que sumarizam as características de exposição, constando a Função; Descrição da função e Atividades/Fatores de Risco e Perigos resumindo as principais informações do Inventário de Risco, incluindo a Severidade, Probabilidade e principalmente o Risco Ocupacional. om o Organograma – Macroestrutura, a empresa encontra-se organizada através de Setores. Na tabela a seguir são apresentados os setores como as respectivas quantidades de trabalhadores.',
//         },
//       ],
//     },
//   ],
// };
