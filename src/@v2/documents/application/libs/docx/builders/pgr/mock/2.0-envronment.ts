import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const environmentSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.CHAPTER,
      text: `??${VariablesPGREnum.CHAPTER_2}??`,
    },
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.TITLE,
          text: `??${VariablesPGREnum.CHAPTER_2}?? (NR-01 ‘itens’ 1.5.4.2 e 1.5.4.3)`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'CARACTERIZAÇÃO DOS PROCESSOS E AMBIENTES DE TRABALHO (NR-01 ‘itens’ 1.5.4.2 e 1.5.7.3.2 alínea a)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `A caracterização dos ambientes de trabalho é uma ferramenta importante na graduação do Risco Ocupacional dos empregados, pois fornece uma visão geral dos processos, dos riscos presentes e das fontes geradoras desses riscos. Através da análise de fluxogramas, layouts, diagramas e da própria descrição de cada processo de trabalho, podemos identificar oportunidades de implantação de medidas de controle capazes de minimizar ou até mesmo eliminar os riscos de exposição para os trabalhadores. Os ambientes de trabalho são classificados nas categorias a seguir:`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Ambientes Gerais:** Nos ambientes considerados gerais são aqueles que não possuem uma destinação específica e certamente são isentos de riscos próprios, envolve áreas comuns de circulação e normalmente sem restrição de acesso ao público, tais como: Fachada da empresa, Roll de entrada, ambientes de espera, pátios, áreas de recreação, etc.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Ambientes Administrativos:** Nos ambientes administrativos são executadas atividades diversas sem relação direta com o processo produtivo e pouco relacionadas com riscos físicos, químicos e biológicos, mas é possível encontrar alguns fatores de riscos ergonômicos e até mesmo de acidentes, no entanto de baixa severidade.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Ambientes de Apoio:** Nos ambientes de apoio são executadas atividades que dão suporte às atividades operacionais da empresa, normalmente envolvem Fatores de Riscos e Perigos característicos ao que é executado nos seus postos de trabalho gerando exposições primárias, são exemplos os seguintes ambientes: Oficinas diversa, laboratórios, estações de tratamento (efluentes), pátios de resíduos, etc.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Ambientes Operacionais:** Nos ambientes operacionais são executadas atividades que resultam no produto ou serviço fim da empresa, ou seja, onde ocorre o processo produtivo, normalmente são os ambientes de maior concentração de Fatores de Riscos e Perigos envolvendo quase sempre exposições primárias e secundárias.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `A seguir é apresentada uma relação dos diversos ambientes que compreendem a **??${VariablesPGREnum.COMPANY_SHORT_NAME}??** com suas respectivas atribuições e descrição dos seus respectivos processos produtivos.`,
        },
      ],
    },
    {
      type: DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS,
    },
    // {
    //   type: PGRSectionTypeEnum.SECTION,
    //   footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    //   children: [
    //     {
    //       type: PGRSectionChildrenTypeEnum.TITLE,
    //       text: `??${VariablesPGREnum.CHAPTER_2}??`,
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.H1,
    //       text: 'CARACTERIZAÇÃO DOS PROCESSOS E AMBIENTES DE TRABALHO (NR-01 ‘itens’ 1.5.4.2 e 1.5.7.3.2 alínea a)',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH,
    //       text: `A caracterização dos ambientes de trabalho é uma ferramenta importante na graduação do risco de exposição dos empregados, pois fornece uma visão geral dos processos, dos riscos presentes e das fontes geradoras desses riscos. Através da análise de fluxogramas, layouts, diagramas e da própria descrição de cada processo de trabalho, podemos identificar oportunidades de implantação de medidas de controle capazes de minimizar ou até mesmo eliminar os riscos de exposição para os trabalhadores`,
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH,
    //       text: `A seguir é apresentada uma relação dos diversos ambientes que compreendem a **??${VariablesPGREnum.COMPANY_SHORT_NAME}??** com suas respectivas atribuições e descrição dos seus respectivos processos produtivos.`,
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.H2,
    //       text: 'Visão Geral dos Ambientes',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH,
    //       text: 'TEXTO ALEX',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL,
    //       removeWithSomeEmptyVars: [
    //         VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL,
    //       ],
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.BREAK,
    //       removeWithSomeEmptyVars: [
    //         VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL,
    //       ],
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.H2,
    //       text: 'Ambientes Administrativos',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH,
    //       text: 'Nos ambientes administrativos são executadas atividades diversas pouco relacionadas com riscos físicos, químicos e biológicos, mas é possível encontrar alguns fatores de riscos ergonômicos e até mesmo de acidentes, no entanto de baixa severidade.',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM,
    //       removeWithSomeEmptyVars: [
    //         VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM,
    //       ],
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.BREAK,
    //       removeWithSomeEmptyVars: [
    //         VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM,
    //       ],
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.H2,
    //       text: 'Ambientes Operacionais',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH,
    //       text: 'FAZER TESTO EXPLICANDO O QUE SÃO CONSIDERADOS Ambientes Operacionais',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP,
    //       removeWithSomeEmptyVars: [
    //         VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP,
    //       ],
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.BREAK,
    //       removeWithSomeEmptyVars: [
    //         VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP,
    //       ],
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.H2,
    //       text: 'Ambientes de Apoio',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH,
    //       text: 'FAZER TESTO EXPLICANDO O QUE SÃO CONSIDERADOS Ambientes de apoi',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP,
    //       removeWithSomeEmptyVars: [
    //         VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP,
    //       ],
    //     },
    //   ],
    // },
  ],
};
