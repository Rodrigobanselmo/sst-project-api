import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const qualitySection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.CHAPTER,
      text: `??${VariablesPGREnum.CHAPTER_3}??`,
    },
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.TITLE,
          text: `??${VariablesPGREnum.CHAPTER_3}?? (NR-01 ‘ITEM’ 1.5.4.4)`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'AVALIAÇÃO QUALITATIVA DOS RISCOS (NR-01 ‘item’ 1.5.3.2 alínea c)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: "A determinação do Risco Ocupacional (Potencial de Risco), a que estão submetidos cada um dos GSE's aos diversos Fatores de Risco e sua priorização é feita com base na estimativa do Grau de Exposição (Probabilidade) x Grau de Efeitos à Saúde (Severidade) desses agentes.",
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: "Esta classificação qualitativa do Potencial de Risco é um dos objetivos principais do PGR e é importante para estabelecer a necessidade e priorização dos GSE's e Fatores de Risco a serem avaliados quantitativamente, além de tarefas, atividades e locais com alto potencial de risco de exposição, de modo que se tenha uma utilização efetiva dos recursos disponíveis.",
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: "Esta estimativa do Risco Ocupacional é particularmente difícil quando estão envolvidos muitos Fatores de Risco e vários GSE's e/ou cargos. Nestes casos, quanto aos agentes Fatores de Riscos Químicos (FRQ), podemos excluir de imediato para classificação do Risco Ocupacional, aqueles que se enquadrem nos seguintes critérios:",
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_QUI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Usado somente em pequenas quantidades (ex.: quantidades em gramas ou mililitros), resultando num baixo Risco Ocupacional – Caso de Laboratórios.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_QUI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Manipulado em embalagens herméticas, tais como os vidros de reagentes e produtos entamborados (ex.: Laboratório, Armazéns e Almoxarifados).',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_QUI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Uso infrequente ou possibilidade infrequente de contato (Probabilidade 1 e 2).',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_QUI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Baixa toxicidade do agente (Grau de Efeitos à Saúde 1 e 2).',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_QUI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A estimativa do Risco Ocupacional para os FRQ foi baseada em observações “in loco” dos ambientes, setores, postos de trabalho, equipamentos dos processos e no julgamento profissional da equipe de avaliação, considerando variável tais como: concentração dos Fatores de Riscos, tempo de permanência junto à fonte de emissão e tipo de atividade.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `No caso da ??${VariablesPGREnum.COMPANY_SHORT_NAME}??, foram priorizados de um modo geral, para efeito de avaliação qualitativa do Risco Ocupacional, os seguintes agentes químicos:`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_QUI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Nenhum fator de risco quimíco foi caracterizado.',
          removeWithAllValidVars: [VariablesPGREnum.HAS_RISK_QUI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '\nQuanto aos Fatores de Risco Físicos, foram considerados para avaliação qualitativa os agentes listados abaixo:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_FIS],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Nenhum fator de risco físico foi caracterizado.',
          removeWithAllValidVars: [VariablesPGREnum.HAS_RISK_FIS],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '\nQuanto aos Fatores de Risco Biológicos, foram considerados para avaliação qualitativa os agentes listados abaixo:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_BIO],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Nenhum fator de risco biológico foi caracterizado.',
          removeWithAllValidVars: [VariablesPGREnum.HAS_RISK_BIO],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '\nQuanto aos Fatores de Risco Ergonômicos, foram considerados para avaliação qualitativa as situações listadas abaixo:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_ERG],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Nenhum fator de risco ergônomico foi caracterizado.',
          removeWithAllValidVars: [VariablesPGREnum.HAS_RISK_ERG],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '\nQuanto aos perigos de acidente, foram considerados para avaliação qualitativa as situações listadas abaixo:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_RISK_ACI],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Nenhum fator de risco / perigo de acidente foi caracterizado.',
          removeWithAllValidVars: [VariablesPGREnum.HAS_RISK_ACI],
        },
      ],
    },
  ],
};
