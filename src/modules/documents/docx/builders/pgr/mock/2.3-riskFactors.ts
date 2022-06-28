import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const riskFactors2Section: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'Caracterização dos Fatores de Risco Ocupacional',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Na Tabela a seguir é apresentada toda estrutura organizacional da TOXILAB onde encontra-se assinalado com um X os fatores de risco presentes em cada departamento da empresa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Número internacional CAS – Chemical Abstract Service;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Principais Sintomas',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Principais sintomas efeitos crônicos à saúde;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Carcinogenicidade',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '(ACGIH) (isto é, A1, A2, A3, A4 e A5)',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'LINACH (Isto é: I Grupo 1 carcinogênicos para humanos; II Grupo 2A provavelmente carci-nogênicos para humanos; e III Grupo 2B possivelmente carcinogênicos para humanos;',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Grau de Efeito à Saúde – GES; conforme item 6.3.1;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Pressão de Vapor – PV;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Ponto de Ebulição – PE;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Potencial de Ionização – PI;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'IDLH (IPVS) – Imediatamente Perigoso à Vida ou à Saúde;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Limites de Tolerância (NR-15, ACGIH);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Limites de Tolerância ',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'NR-15 ',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'CMPT ',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'TETO ',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'VMP ',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'ACGIH ',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'TLV-TWA ',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Ceiling ',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'TLV-STEL',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Indicador Biológico de Exposição (BEI);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme a ACGIH, a carcinogenicidade das substâncias químicas está classificada nas seguintes cate-gorias:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A1** – Carcinógeno Humano Confirmado: O agente é carcinógeno para o ser humano, com base em evi-dências de estudos epidemiológicos.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A2** – Carcinógeno Humano Suspeito: Dados obtidos para seres humanos são considerados qualitativamen-te adequados, porém, são conflitantes ou insuficientes para classificar o agente como carcinogênico humano confirmado; ou o agente é carcinógeno em experimentos animais, em dose (s), por via de admi-nistração, em locais, tipo (s) histológico (s), ou por mecanismo (s) que possam ser considerados relevantes para a exposição do trabalhador. A notação A2 é usada principalmente quando há evidência limitada de carcinogenicidade no homem e evidência suficiente de carcinogenicidade nas experiências em ani-mais, com relevância para os seres humanos.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A3** – Carcinogênico Animal Confirmado com Relevância Desconhecida para Seres Humanos: O agente é carcinogênico em experimentos com animais, em doses relativamente altas por via de administração, em locais, tipo (s) histológico (s), ou por mecanismo (s) que podem não ser considerados relevantes para a exposição do trabalhador.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A4** – Não Classificável como Carcinogênico Humano: Agentes que, suspeita-se, possam ser carcinogêni-cos para o ser humano, mas cujos dados existentes são insuficientes para se afirmar isso de forma conclu-siva.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A5** – Não Suspeito como Carcinogênico Humano: Não se suspeita que o agente seja carcinogênico para os seres humanos, com base em pesquisas epidemiológicas bem conduzidas em seres humanos.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme a PORTARIA INTERMINISTERIAL MTE/MS/MPS Nº 9, DE 07 DE OUTUBRO DE 2014 DOU 08/10/2014, a carcinogenicidade das substâncias químicas está classificada nas seguintes categorias:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Lista Nacional de Agentes Cancerígenos para Human**os** – LINACH**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'I Grupo 1 carcinogênicos para humanos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'II Grupo 2A provavelmente carcinogênicos para humanos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'III Grupo 2B possivelmente carcinogênicos para humanos.',
          level: 0,
        },
      ],
    },
  ],
};
