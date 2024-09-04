import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const riskFactors2Section: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Caracterização dos Fatores de Risco Ocupacional',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Na Tabela a seguir é apresentada toda estrutura organizacional da ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? onde encontra-se assinalado com um X os fatores de risco presentes em cada departamento da empresa.`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Número internacional CAS – Chemical Abstract Service;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Principais Sintomas',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Principais sintomas efeitos crônicos à saúde;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Carcinogenicidade',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '(ACGIH) (isto é, A1, A2, A3, A4 e A5)',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'LINACH (Isto é: I Grupo 1 carcinogênicos para humanos; II Grupo 2A provavelmente carcinogênicos para humanos; e III Grupo 2B possivelmente carcinogênicos para humanos;',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Grau de Efeito à Saúde – GES; conforme item 6.3.1;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Pressão de Vapor – PV;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Ponto de Ebulição – PE;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Potencial de Ionização – PI;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'IDLH (IPVS) – Imediatamente Perigoso à Vida ou à Saúde;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Limites de Tolerância (NR-15, ACGIH);',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Limites de Tolerância ',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'NR-15 ',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'CMPT ',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'TETO ',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'VMP ',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'ACGIH ',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'TLV-TWA ',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Ceiling ',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'TLV-STEL',
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Indicador Biológico de Exposição (BEI);',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme a ACGIH, a carcinogenicidade das substâncias químicas está classificada nas seguintes categorias:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A1** – Carcinógeno Humano Confirmado: O agente é carcinógeno para o ser humano, com base em evidências de estudos epidemiológicos.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A2** – Carcinógeno Humano Suspeito: Dados obtidos para seres humanos são considerados qualitativamente adequados, porém, são conflitantes ou insuficientes para classificar o agente como carcinogênico humano confirmado; ou o agente é carcinógeno em experimentos animais, em dose (s), por via de administração, em locais, tipo (s) histológico (s), ou por mecanismo (s) que possam ser considerados relevantes para a exposição do trabalhador. A notação A2 é usada principalmente quando há evidência limitada de carcinogenicidade no homem e evidência suficiente de carcinogenicidade nas experiências em animais, com relevância para os seres humanos.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A3** – Carcinogênico Animal Confirmado com Relevância Desconhecida para Seres Humanos: O agente é carcinogênico em experimentos com animais, em doses relativamente altas por via de administração, em locais, tipo (s) histológico (s), ou por mecanismo (s) que podem não ser considerados relevantes para a exposição do trabalhador.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A4** – Não Classificável como Carcinogênico Humano: Agentes que, suspeita-se, possam ser carcinogênicos para o ser humano, mas cujos dados existentes são insuficientes para se afirmar isso de forma conclusiva.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**A5** – Não Suspeito como Carcinogênico Humano: Não se suspeita que o agente seja carcinogênico para os seres humanos, com base em pesquisas epidemiológicas bem conduzidas em seres humanos.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme a PORTARIA INTERMINISTERIAL MTE/MS/MPS Nº 9, DE 07 DE OUTUBRO DE 2014 DOU 08/10/2014, a carcinogenicidade das substâncias químicas está classificada nas seguintes categorias:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Lista Nacional de Agentes Cancerígenos para Human**os** – LINACH**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'I Grupo 1 carcinogênicos para humanos;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'II Grupo 2A provavelmente carcinogênicos para humanos;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'III Grupo 2B possivelmente carcinogênicos para humanos.',
          level: 0,
        },
      ],
    },
  ],
};
