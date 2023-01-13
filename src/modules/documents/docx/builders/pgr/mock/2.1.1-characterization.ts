import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const characterizationSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'CARACTERIZAÇÃO DAS ATIVIDADES / (NR-01 ‘item’ 1.5.7.3.2 alínea b)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A caracterização da Mão de Obra é mais eficiente quando se analisa as diversas Atividades/Tarefas; Postos de Trabalho e Equipamentos sendo uma ferramenta importante na graduação do Risco Ocupacional dos empregados, pois fornece uma visão detalhada dos Procedimentos Operacionais (PO), permitindo identificar os riscos presentes e as fontes geradoras desses riscos. Através da análise de cada etapa dos PO's, sejam esses formalizados (escritos e oficiais), ou não, fornecendo uma visão do GRO da teoria à prática. A caracterização da Mão de Obra neste PGR foi categorizada de três formas:`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Posto de Trabalho:** Consiste na análise dos Fatores de Riscos e Perigos (FR/P) com base nas características dos locais onde as principais tarefas são executadas, é fundamental para entender como o local de trabalho afeta as atividades executadas e consequentemente impactam no FR/P.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Atividades:** Consiste na análise dos Fatores de Riscos e Perigos (FR/P) com base nas características das atividades executadas, é fundamental para entender como a forma de executar os procedimentos operacionais (tarefas rotineiras de cada trabalhador) impactam no FR/P.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Equipamentos:** Consiste na análise dos Fatores de Riscos e Perigos (FR/P) com base nas características dos equipamentos e ferramentas com que as principais tarefas são executadas, é fundamental para entender como estes "instrumentos" afetam as atividades executadas e consequentemente impactam no FR/P.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A seguir é apresentada uma relação das diversas Categorias de Caracterização da Mão de Obra  da **??${VariablesPGREnum.COMPANY_SHORT_NAME}??** com suas descrições e respectivos Fatores de Riscos e Perigos identificados.`,
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
